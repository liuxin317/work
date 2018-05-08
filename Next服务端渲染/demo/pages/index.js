import React, { Component } from 'react'
import Head from 'next/head'
import Link from 'next/link'
// import img01 from '../images/community_head_img.jpg'

class A extends Component {
    render () {
        return <h4>我是A</h4>
    }
}

class B extends Component {
    render () {
        return <h4>我是B</h4>
    }
}

export default () => (
    <div>
        <Head>
            <title>League Table</title>
            <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            <link rel="stylesheet" href="https://unpkg.com/purecss@0.6.1/build/pure-min.css" />
        </Head>
        <h1>This is just so easy!</h1>
        <A />
        <Link prefetch href={`/details`}><a>More...</a></Link>
    </div>
)