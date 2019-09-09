import React, { Component } from 'react'
import { FaGithubAlt, FaPlus, FaSpinner } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import api from '../../services/api'
import { Container, Form, List, SubmitButton } from './styles'

export default class Main extends Component {
  state = {
    newRepo: '',
    repositories: [],
    loading: false,
  }

  componentDidMount() {
    const repositories = localStorage.getItem('repositories')
    console.log(repositories)
    if (repositories) {
      this.setState({ repositories: JSON.parse(repositories) })
    }
  }

  componentDidUpdate(_, prevState) {
    const { repositories } = this.state
    if (prevState.repositories !== repositories) {
      localStorage.setItem('repositories', JSON.stringify(repositories))
    }
  }

  handleInputChange = e => {
    this.setState({ newRepo: e.target.value })
  }

  handleSubmit = async e => {
    const { newRepo, repositories } = this.state
    e.preventDefault()

    this.setState({ loading: true })

    const response = await api.get(`/repos/${newRepo}`)

    const data = { name: response.data.full_name }

    this.setState({
      repositories: [...repositories, data],
      newRepo: '',
      loading: false,
    })
  }

  render() {
    const { newRepo, repositories, loading } = this.state
    return (
      <Container>
        <h1>
          <FaGithubAlt />
          repositórios
        </h1>
        <Form onSubmit={this.handleSubmit}>
          <input
            type="text"
            value={newRepo}
            onChange={this.handleInputChange}
            placeholder="Adicionar repositório"
          />
          <SubmitButton loading={loading}>
            {loading ? (
              <FaSpinner color="#FFF" size={14} />
            ) : (
              <FaPlus color="#FFF" size={14} />
            )}
          </SubmitButton>
        </Form>
        <List>
          {repositories.map(respository => (
            <li key={respository.name}>
              <span>{respository.name}</span>
              <Link to={`/repository/${encodeURIComponent(respository.name)}`}>
                Detalhes
              </Link>
            </li>
          ))}
        </List>
      </Container>
    )
  }
}
