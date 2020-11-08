import React, { Component } from 'react';
import isEqual from 'lodash/isEqual';
import Button from 'react-bootstrap/Button';

const MAP_KEY = process.env.REACT_APP_MAPS_KEY;

const initialPosition = {
  lat: 48.866597,
  lng: 2.314670,
}

const initialZoom = 15;

const styleMap = {
  width: '100%',
  height: '100%'
}

class GoogleMap extends Component {

  constructor(props) {
    super(props);
    this.state = {
      googleMapScript: '',
      googleMap: '',
      drawingManager:'',
      planInMap: null,
    };
    this.googleMapRef = React.createRef();
  }

  initScript = () => {
    const googleMapScript = document.createElement('script');
    googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=${MAP_KEY}&libraries=drawing,geometry`;
    window.document.body.appendChild(googleMapScript);
    googleMapScript.addEventListener('load', () => {
      const googleMap = this.createGoogleMap();
      const drawingManager = this.createDrawingManager();
      drawingManager.setMap(googleMap);
      this.setState({
        googleMapScript,
        googleMap,
        drawingManager,
      }, () => this.createNewFlightPlan());      
    });
  }

  mapInit = () => {
    if (!this.state.googleMapScript) this.initScript();
    else {
      const googleMap = this.createGoogleMap();
      const drawingManager = this.createDrawingManager();
      drawingManager.setMap(googleMap);
      this.setState({
        googleMap,
        drawingManager,
      }, () => this.createNewFlightPlan());      
    }
  }

  createNewFlightPlan = () => {
    new window.google.maps.event.addListener(this.state.drawingManager, 'overlaycomplete', (polyline) => {
      const path = polyline.overlay.getPath();
      let myPath = [];
      const len = path.getLength();
      for (let i = 0; i < len; i++) {
        const lat = path.getAt(i).lat();
        const lng = path.getAt(i).lng();
        myPath.push({lat, lng});
      }

      const id = new Date().valueOf();
      const myFlightPlan = {
        id,
        name: '', 
        path: myPath
      }
      this.props.storeTmpFlightPlan(myFlightPlan);
    });
  }
  
  createGoogleMap = (center = initialPosition) => new window.google.maps.Map(this.googleMapRef.current, {
      zoom: initialZoom,
      center,
      disableDefaultUI: true,
    }
  );

  createDrawingManager = () => new window.google.maps.drawing.DrawingManager({
    drawingMode: window.google.maps.drawing.OverlayType.POLYLINE,
    drawingControl: false,
    drawingControlOptions: {
      position: window.google.maps.ControlPosition.TOP_CENTER,
      drawingModes: [],
    },
    polylineOptions: {
      fillColor: "#ff0000",
      fillOpacity: 1,
      strokeWeight: 5,
      clickable: false,
      editable: true,
      zIndex: 1,
    },
  });

  showPlanInMap = () => {
    const path = this.state.planInMap.path;
    const map = this.createGoogleMap(path[0]);
    const bounds  = new window.google.maps.LatLngBounds();
    path.forEach( p => {
      bounds.extend(p);
    })
    map.fitBounds(bounds);
    map.panToBounds(bounds);
    const flightPath = new window.google.maps.Polyline({
      path: path,
      geodesic: true,
      strokeColor: "#FF0000",
      strokeOpacity: 1.0,
      strokeWeight: 5,
    });
    flightPath.setMap(map);
  }

  componentDidMount() {
    this.initScript();
  }

  componentDidUpdate() {
    if ((!this.state.planInMap && this.props.planInMap) || !isEqual(this.state.planInMap, this.props.planInMap)) {
      this.setState({
        planInMap: this.props.planInMap
      }, this.showPlanInMap)
    }

    if (this.props.reloadMap) {
      this.mapInit();
      this.props.toggleReloadMap();
    }
  }

  render() {  
    return (
      <div className="container-map">
        <div className="map">
          <Button variant="success" className="start-drawing-button" onClick={this.mapInit}>Draw a New Flight Plan</Button>
          <Button variant="warning" className="reset-button" onClick={this.mapInit}>Reset Map</Button>
          <div
            id="google-map"
            ref={this.googleMapRef}
            style={{ width: styleMap.width, height: styleMap.height }}
          />
        </div>
      </div>
    )
  }  
}

export default GoogleMap;
