import React from 'react'
import LoadingLogo from './150.gif'
import './Loading.css'

export default function Loading() {
  return(
  <div class="loading">
    <img src={LoadingLogo} alt="loading" />
  </div>
  );
}