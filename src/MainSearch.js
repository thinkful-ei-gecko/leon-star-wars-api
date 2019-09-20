import React from 'react'
import GoldDivider from './GoldDivider'
import SearchForm from './SearchForm'
import './MainSearch.css'
import './Button.css'

export default function MainSearch(props) {
  return(
    <section>
    <p className="instructions">Enter a <span className="bold">search term</span> and <span className="bold">category</span> and we'll find what matches!</p>
    <GoldDivider />
    <SearchForm categories={props.categories} apiCall={props.apiCall} />
    </section>
  );
}