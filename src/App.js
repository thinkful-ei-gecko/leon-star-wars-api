import React from 'react';
import './App.css';
import MainSearch from './MainSearch'
import MainResults from './MainResults'
import {Route, withRouter, Link} from 'react-router-dom'
import Loading from './Loading'

class App extends React.Component {
  state = {
    rootCategories : {},
    results : {},
    category: '',
    searchTerm: ''
  }

  clearResults = () => {
    this.setState({
      results : {}
    },this.props.history.push('/'))
  }

  populateResults = (list,category,searchTerm) => {
    console.log(list);
    this.setState({
      results : list,
      category,
      searchTerm,
    },this.props.history.push('/results'))
  }

  populateSelect = (rootList) => {
    this.setState({
      rootCategories : rootList
    })
  }


  checkIfMore = (data, category, searchTerm, previousResults = []) => {
    if (data.count) {
      let newResults = [];
      data.results.forEach(result => {
        if (result.name) {
          newResults.push(result.name);
        }
        else if (result.title) {
          newResults.push(result.title);
        }
      });
      previousResults = [
        ...previousResults,
        ...newResults
      ];
      if (data.next) {
        this.callCategoryAPI(category,searchTerm, data.next, previousResults)
      }
      else {
        this.populateResults(previousResults,category,searchTerm);
      }
    }
    else {
      this.populateResults(previousResults,category,searchTerm);
    }
  }

  callResultsFill = (category,searchTerm) => {
    this.props.history.push('/loading');
    this.callCategoryAPI(category,searchTerm)
  }

  callCategoryAPI = (category,searchTerm,url,previousResults) => {
    if (!url) {
      url = `https://cors-anywhere.herokuapp.com/https://swapi.co/api/${category}/?search=${searchTerm}`
    }
    fetch(url)
    .then(res => {
      if (res.ok) {
        return res.json();
      }
      else {
        throw new Error('200 status error');  
        }
      })
    .then(resJson => {
      console.log(resJson);
      this.checkIfMore(resJson, category, searchTerm, previousResults);
    })
    .catch(e => console.error(`There was an error ${e}`))
  }

  callRootAPI = () => {
    fetch(`https://cors-anywhere.herokuapp.com/https://swapi.co/api/`)
    .then(res => {
      if (res.ok) {
        return res.json();
      }
      throw new Error('200 status error');
    })
    .then(resJson => this.populateSelect(resJson))
    .catch(e => console.error(`There was an error ${e}`))
  }

  componentDidMount() {
    this.callRootAPI(this.populateSelect);
  }

  render() {
    return (
      <div className="App">
        <header>
          <Link to='/'><h1>
            Star Wars
            <span>API Search</span>
          </h1></Link>
        </header>
        <main>
          <Route exact path = "/" render={() => 
            <MainSearch categories={this.state.rootCategories} apiCall={this.callResultsFill}/>}  />
            <Route path="/loading" component={Loading} />
          <Route path ="/results" render={() => 
            <MainResults results={this.state.results} clear={this.clearResults} category={this.state.category} searchTerm={this.state.searchTerm}>
          </MainResults>} />
        </main>
      </div>
    );
  }
}

export default withRouter(App);