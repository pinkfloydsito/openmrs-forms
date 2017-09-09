import React, { Component } from "react"
import ReactTable from "react-table"
import PropTypes from "prop-types"
import 'react-table/react-table.css'
import { hashHistory } from "react-router"
import { Jumbotron, Button, Modal, OverlayTrigger, form, FormGroup, FormControl, HelpBlock, ControlLabel, table } from "react-bootstrap"
import Moment from "moment"

class Vitals extends Component {

  constructor(props) {
    super(props)
    this.state = {
      groupedObservations: new Map(),
      dateObservations: new Map(),
    }
    this.handleReturnClick = this.handleReturnClick.bind(this)
  }

  /* Fetching the observations taken to the patient... */
  componentWillMount() {
    const encounters = this.props.visitSelected.encounters
    this.props.fetchObs(encounters)
  }

  handleReturnClick() {
    hashHistory.push("/search")
  }
  mapObs() {
    const newMap = new Map()
    const newDateMap = new Map()
    const data = []
    const columns = []
    this.props.obs.forEach((observation) => {
      if (typeof newDateMap.get(observation.obsDatetime) === "undefined" || typeof newDateMap.get(observation.obsDatetime) === "null") {
        newDateMap.set(observation.obsDatetime, new Map())
      } else {
        newDateMap.get(observation.obsDatetime).set(observation.concept.display, observation)
      }

      if (typeof newMap.get(observation.concept.display) === "undefined") {
        newMap.set(observation.concept.display, [])
      }
      newMap.get(observation.concept.display).push(observation)
    })

    for (const [key, value] of newMap) {
      const observationDate = { name: key }
      value.forEach((ob) => {
        let date = new Date(ob.obsDatetime)
        date = Moment(date)
        date.locale("es")
        date = date.format("dddd, MMMM Do YYYY, h:mm:ss a")
        observationDate[date] = ob.value
      })
      data.push(observationDate)
    }
    const obj = {
      Header: "Signo Vital",
      accessor: "name",
    }
    columns.push(obj)
    for (const key of newDateMap.keys()) {
      let date = new Date(key)
      date = Moment(date)
      date.locale("es")
      date = date.format("dddd, MMMM Do YYYY, h:mm:ss a")
      columns.push({ Header: date, accessor: date })
    }
    return [data, columns]
  }
  render() {
    if (Object.keys(this.props.visitSelected).length === 0 && this.props.visitSelected.constructor === Object) {
      return (
        <Jumbotron>
          <h1> No se ha realizado la seleccion de una cita </h1>
          <p>Acepte el mensaje para continuar</p>
          <p><Button bsStyle="danger" onClick={this.handleReturnClick} >Ir a Seleccion de Visitas</Button></p>
        </Jumbotron>
      )
    } else if (this.props.obs.length === 0) {
      return (
        <Jumbotron>
          <h1>No hay Observaciones realizadas</h1>
          <p>Acepte el mensaje para continuar</p>
          <p><Button bsStyle="danger" onClick={this.handleReturnClick} >Ir a Seleccion de Visitas</Button></p>
        </Jumbotron>
      )
    }
    const total = this.mapObs()
    const columns = this.mapObs()[1]
    const data = this.mapObs()[0]
    console.info("TOTAL: ", total)
    return (
 <ReactTable
    data={data}
    columns={columns}
  />
    )
  }
}

export default Vitals
