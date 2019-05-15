import React, { Component, Fragment } from 'react';
import axios from 'axios';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import Toggle from 'react-toggle'
import "react-toggle/style.css"

import './style.css'

const baseUrl = 'https://todolist-api-rest.herokuapp.com/todo'

const initialState = {
  todo: { description: '' },
  list: []
}

class App extends Component {

  constructor(props) {
    super(props)
    this.state = { ...initialState }
  }

  notifySuccess(message) {
    toast.success(message, {
      position: toast.POSITION.TOP_RIGHT
    });
  }

  notifyError(message) {
    toast.error(message, {
      position: toast.POSITION.TOP_RIGHT
    });
  }

  componentWillMount() {
    this.getUpdatedList()
  }

  getUpdatedList() {
    axios(`${baseUrl}`).then(resp => {
      console.log(resp)
      this.setState({ list: resp.data.result })
    })
  }

  save() {
    const todoItem = this.state.todo
    console.log(todoItem)
    axios.post(baseUrl, todoItem)
      .then(resp => {
        console.log(resp)
        this.notifySuccess('Saved successfully')
        this.getUpdatedList()
        this.setState({ todo: initialState.todo })
      })
      .catch(err=>{
        console.log(err)
      })
  }

  updateStatus(todo) {
    axios.put(`${baseUrl}/${todo.id}`, todo)
      .then(resp => {
        this.notifySuccess('Successfully updated')
        this.getUpdatedList()
        this.setState({ todo: initialState.todo })
      })
  }

  remove(todo) {
    axios.delete(`${baseUrl}/${todo.id}`).then(resp => {
      this.notifySuccess('Successfully deleted')
      this.getUpdatedList()
    })
  }


  handleChange(e) {
    const todo = { ...this.state.todo }
    todo.description = e.target.value
    this.setState({ todo })
  }

  renderForm() {
    const todoItem = { ...this.state.todo }
    return (
      <div className="row form">
        <div class="col-lg-12">
          <div class="card">
            <div class="card-header d-flex align-items-center">
              <h3 class="h4">Insert new task</h3>
            </div>
            <div class="card-body">
              <form>
                <div class="form-group">
                  <label for="description">Description</label>
                  <input type="text" class="form-control" id="description" name="description" placeholder="Description..."
                    value={todoItem.description}
                    onChange={e => this.handleChange(e)} />
                </div>
                <button type="button" class="btn btn-primary" onClick={e => this.save()} >Save</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }

  renderTable() {
    return (
      <div className="row">
        <div class="col-lg-12">
          <div class="card">
            <div class="card-header d-flex align-items-center">
              <h3 class="h4">Todo list</h3>
            </div>
            <div class="card-body">
              <div class="table-responsive">
                <table class="table table-striped">
                  <thead>
                    <tr>
                      <th>Description</th>
                      <th className="action">Status</th>
                      <th className="action">Remove</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.renderRows()}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  renderRows() {
    return this.state.list.map(todoItem => {
      return (
        <tr key={todoItem.id}>
          <td>{todoItem.description}</td>
          <td className="action">
            <Toggle
              id='cheese-status'
              defaultChecked={todoItem.status == 1 ? true : false}
              onChange={() => this.updateStatus(todoItem)} />
          </td>
          <td className="action"><button className="btn btn-danger" onClick={() => this.remove(todoItem)}>Remove</button></td>
        </tr>
      )
    })
  }

  render() {
    return (
      <Fragment>
        <div class="page">
          <nav class="navbar navbar-light bg-light">
            <a class="navbar-brand" href="#">
              <img src="https://getbootstrap.com/docs/4.0/assets/brand/bootstrap-solid.svg" width="30" height="30" class="d-inline-block align-top logo" alt="" />
              Bootstrap
            </a>
          </nav>
          <div className="container">
            {this.renderForm()}
            {this.renderTable()}
          </div>
        </div>
        <ToastContainer />
      </Fragment>
    );
  }
}

export default App;