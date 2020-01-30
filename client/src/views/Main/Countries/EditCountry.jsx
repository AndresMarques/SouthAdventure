import React from "react";
import { connect } from 'react-redux';
import { editCountryRequest } from '../../../store/actions/wheelActions';

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

// @material-ui/icons
import FlagIcon from "@material-ui/icons/Flag";

// core components
import GridContainer from "../../../components/Grid/GridContainer.jsx";
import GridItem from "../../../components/Grid/GridItem.jsx";
import CustomInput from "../../../components/CustomInput/CustomInput.jsx";
import Button from "../../../components/CustomButtons/Button.jsx";
import Card from "../../../components/Card/Card.jsx";
import CardHeader from "../../../components/Card/CardHeader.jsx";
import CardIcon from "../../../components/Card/CardIcon.jsx";
import CardBody from "../../../components/Card/CardBody.jsx";

import regularFormsStyle from "../../../assets/jss/material-dashboard-pro-react/views/regularFormsStyle";

class EditCountry extends React.Component {
  state = {
    data: {
      country: '',
    },
    errors: {
    },
  }
  componentWillMount() {
    const id = this.props.match.params.id;
    let obj = this.props.countries.find(o => o.country_id === id);

    if(obj) {
      this.setState(prevState => {
        return {
          ...prevState,
          data: { ...prevState.data, ...obj },
          errors: { ...prevState.errors }
        };
      });
    } else {
      this.props.history.push('/country');
    }
  }
  handleInputChange = (e) => {
    const field = e.target.id;
    const value = e.target.value;

    this.setState((prevState) => {
      return {
          ...prevState,
          data: {
              ...prevState.data,
              [field]: value
          },
          errors: {
            ...prevState.errors,
            [field]: ''
          }
      };
    });
  }
  handleSubmit = (e) => {
    e.preventDefault();
    var hasError = false;
    if(this.state.data.country === null || this.state.data.country === '') {
      hasError = true;
      this.setState((prevState) => {
        return {
            ...prevState,
            data: {...prevState.data},
            errors: {
              ...prevState.errors,
              country: "This field is required"
            }
        };
      });
    }

    if(!hasError) {
      this.props.editCountryRequest(this.state.data)
      .then(res => {
        if (res.errors) {
          this.setState(prevState => {
            return {
              ...prevState,
              data: {...prevState.data},
              errors: {...prevState.errors, ...res.errors}
            };
          });
        } else {
          this.props.history.push('/country');
        }
      })
    }
  }
  render() {
    const { classes } = this.props;
    return (
      <GridContainer>
        <GridItem xs={12} sm={12} md={6}>
          <Card>
            <CardHeader color="success" icon>
              <CardIcon color="success">
                <FlagIcon />
              </CardIcon>
              <h4 className={classes.cardIconTitle}>Edit Country</h4>
            </CardHeader>
            <CardBody>
              <form onSubmit={this.handleSubmit}>
                <CustomInput
                  labelText="Enter the name of the country"
                  id="country"
                  formControlProps={{
                    fullWidth: true
                  }}
                  inputProps={{
                    onChange: this.handleInputChange,
                    value: this.state.data.country
                  }}
                  error={this.state.errors.country !== undefined && this.state.errors.country !== '' && this.state.errors.country !== null}
                  helpText={this.state.errors.country}
                />
                <Button type="submit" color="success">Submit</Button>
              </form>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    );
  }
}

const mapStateToProps = state => {
  return {
    countries: state.wheels.countries
  }
}

const mapDispatchToProps = dispatch => {
  return {
      editCountryRequest: (data) => dispatch(editCountryRequest(data))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(regularFormsStyle)(EditCountry));
