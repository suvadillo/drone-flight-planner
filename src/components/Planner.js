import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Map from './Map';
import PlansManager from './PlansManager';

const initialFlightPlans = [
  {
    id: 444,
    name: 'sample flight plan', 
    path: [
      { lat: 48.874156, lng: 2.312760 },
      { lat: 48.870627, lng: 2.308211 },
      { lat: 48.868623, lng: 2.313532 },
      { lat: 48.870797, lng: 2.320141 },
      { lat: 48.874410, lng: 2.317781 }
    ],
  }
];

class Planner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      flightPlans: initialFlightPlans,
      planInMap: null,
      newPlan: false,
      reloadMap: false,
    };
  }

  addFlightPlan = name => {
    if (!this.state.newPlan) return;
    this.setState( prev => {
      let flightPlans = [...prev.flightPlans];
      let newPlan = prev.newPlan;
      newPlan.name = name;
      flightPlans.push(newPlan)
      return ({
        ...prev,
        reloadMap: true,
        newPlan: false,
        flightPlans
      })        
    })
  }

  storeTmpFlightPlan = newPlan => this.setState({newPlan})

  showPlanInMap = id => {
    const planInMap = this.state.flightPlans.filter(plan => plan.id === id) && this.state.flightPlans.filter(plan => plan.id === id)[0];
    if (planInMap) {
      this.setState({
        planInMap 
      })
    }
  }

  deletePlan = id => {
    this.setState( prev => {
      const tmpflightPlans = [...prev.flightPlans];
      const flightPlans = tmpflightPlans.filter(plan => plan.id !== id);
      return ({
        ...prev,
        flightPlans
      })        
    })
    if (this.state.planInMap && this.state.planInMap.id === id) {
      this.setState({reloadMap: true})
    }
  }

  toggleReloadMap = () => this.setState({reloadMap: false})

  render() {
    const { flightPlans, planInMap, newPlan, reloadMap } = this.state;
    return (
      <Container>
        <Row>
          <Col xs={12} lg={8}>
            <Map 
              flightPlans={flightPlans}
              storeTmpFlightPlan={this.storeTmpFlightPlan}
              planInMap={planInMap}
              reloadMap={reloadMap}
              toggleReloadMap={this.toggleReloadMap}
            />
          </Col>
          <Col xs={12} lg={4} className="plan-manager">
            <PlansManager 
              flightPlans={flightPlans} 
              showPlanInMap={this.showPlanInMap}
              addFlightPlan={this.addFlightPlan}
              newPlan={newPlan}
              deletePlan={this.deletePlan}
            />
          </Col>
        </Row>
      </Container>
    )
  };
}

export default Planner;