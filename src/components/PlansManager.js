import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

const defaultNameFlightPlan = 'new-plan';

class PlansManager extends Component {

  state = {
    nameNewPlan: defaultNameFlightPlan,
    showAddInput: false,
  }

  onChangeInputValue = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value,
    })
  }

  showAddNewPlan = () => {
    this.setState({
      showAddInput: true,
    })
  }

  addFlightPlan = () => {
    this.props.addFlightPlan(this.state.nameNewPlan);
    this.setState({
      showAddInput: false,
      nameNewPlan: defaultNameFlightPlan,
    })
  }

  discardFlightPlan = () => {
    this.setState({
      showAddInput: false,
      nameNewPlan: defaultNameFlightPlan,
    })
  }

  render() { 
    const { flightPlans, showPlanInMap, deletePlan } = this.props;
    const { showAddInput, nameNewPlan } = this.state;

    return (
      <>
        <Card className="list-plans">        
          {!showAddInput ? (
            <Button variant="success" onClick={this.showAddNewPlan}>Save New Flight Plan</Button>
          ) : (
            <Card.Body>
            <div className="add-new-plan">
              <div className="new-plan-name">
                <label>Name: 
                  <input type="text" name="nameNewPlan" value={nameNewPlan} onChange={this.onChangeInputValue}/>
                </label>
              </div>

              <div className="actions-new-plan">
                <Button variant="success" onClick={this.addFlightPlan} disabled={!this.props.newPlan}>Save</Button>
                <Button variant="warning" onClick={this.discardFlightPlan} >Cancel</Button>
              </div>
            </div>
            </Card.Body>
          )}          
        </Card>

        <hr/>

        <Card>
          <Card.Body>
            <Card.Title style={{textAlign: 'center', fontSize: '28px'}}>List of Plans</Card.Title>
            {flightPlans && flightPlans.map(plan => (
              <Card key={plan.id}>
                <Card.Body>
                  <Card.Title>{plan.name || 'no-name flight plan'}</Card.Title>
                  <Card.Text>
                    {`This Flight Plan has: ${plan.path.length} point-locations`}
                  </Card.Text>
                  <div className="actions-plan-item">
                    <Button variant="primary" onClick={() => showPlanInMap(plan.id)}>Show in Map</Button>
                    <Button variant="danger" onClick={() => deletePlan(plan.id)}>Delete</Button>
                  </div>
                </Card.Body>
              </Card>
            ))}
          </Card.Body>
        </Card>
      </>
    );
  }
}

export default PlansManager;