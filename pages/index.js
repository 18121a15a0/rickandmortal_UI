import Head from 'next/head'
import { useState,useEffect } from 'react';
import Link from 'next/link'

const defaultEndpoint = `https://rickandmortyapi.com/api/character/`;

export async function getServerSideProps() {
  const res = await fetch(defaultEndpoint)
  const data = await res.json();
  return {
    props: {
      data
    }
  }
}



export default function Home({ data }) {
  const { info, results: defaultResults = [] } = data;
const [results, updateResults] = useState(defaultResults);
const [page, updatePage] = useState({
  ...info,
  current: defaultEndpoint
});

const { current } = page;

useEffect(() => {
  if ( current === defaultEndpoint ) return;

  async function request() {
    const res = await fetch(current)
    const nextData = await res.json();

    updatePage({
      current,
      ...nextData.info
    });

    if ( !nextData.info?.prev ) {
      updateResults(nextData.results);
      return;
    }

    updateResults(prev => {
      return [
        ...prev,
        ...nextData.results
      ]
    });
  }

  request();
}, [current]);


function handleLoadMore() {
  updatePage(prev => {
    return {
      ...prev,
      current: page?.next
    }
  });
}


function handleOnSubmitSearch(e) {
  e.preventDefault();

  const { currentTarget = {} } = e;
  const fields = Array.from(currentTarget?.elements);
  const fieldQuery = fields.find(field => field.name === 'query');

  const value = fieldQuery.value || '';
  const endpoint = `https://rickandmortyapi.com/api/character/?name=${value}`;
  

  updatePage({
    current: endpoint
  });
}


  return (
    <div className="container">
      <Head>
        <title>Rick and Mortal</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
     
      <main>
        <h1 className="title">
         Rick and Mortal Api
        </h1>

        <form className="search" onSubmit={handleOnSubmitSearch}>
  <input name="query" type="search" />
  <button>Search</button>
</form>



  <ul className="grid">
  {results.map(result => {
    const { id, name ,gender,species,image} = result;
    return (
    <li key={id} className="card">
  <Link href="/character/[id]" as={`/character/${id}`}>
    <a>
      <img src={image} alt={`${name} Thumbnail`} />
      <h3>{ name }</h3><h5>{gender}</h5><h5>{species}</h5>
    </a>
  </Link>
</li>
    )
  })}
</ul>

<p className="but">
<button onClick={handleLoadMore}>Load More</button>
</p> <br></br>
      <br>
      </br>
      </main>

     

      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        footer {
          position: fixed;
          padding: 10px 10px 0px 10px;
          bottom: 0;
          width: 100%;
          /* Height of the footer*/ 
          height: 40px;
        }

        footer img {
          margin-left: 0.5rem;
        }

        footer a {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        .title a {
          color: #0070f3;
          text-decoration: none;
        }

        .title a:hover,
        .title a:focus,
        .title a:active {
          text-decoration: underline;
        }

        .title {
          margin: 0;
          line-height: 1.15;
          font-size: 4rem;
        }

        .title,
        .description {
          text-align: center;
        }

        .description {
          line-height: 1.5;
          font-size: 1.5rem;
        }

        code {
          background: #fafafa;
          border-radius: 5px;
          padding: 0.75rem;
          font-size: 1.1rem;
          font-family: Menlo, Monaco, Lucida Console, Liberation Mono,
            DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;
        }

        .grid {
          display: flex;
          flex-wrap: wrap;
          height: 400px;
          align-content: space-between;

        }

        .card {
          margin: 4rem;
          flex-basis: 10%;
          padding: 1.5rem;
          text-align: left;
          color: inherit;
          text-decoration: none;
          border: 1px solid #eaeaea;
          border-radius: 10px;
          transition: color 0.15s ease, border-color 0.15s ease;
        }

        .card:hover,
        .card:focus,
        .card:active {
          color: #0070f3;
          border-color: #0070f3;
        }

        .card h3 {
          margin: 0 0 1rem 0;
          font-size: 1.5rem;
        }

        .card p {
          margin: 0;
          font-size: 1.25rem;
          line-height: 1.5;
        }

        .logo {
          height: 1em;
        }

        @media (max-width: 600px) {
          .grid {
            width: 100%;
            flex-direction: column;
          }
        }

        .search input {
          margin-right: .5em;
        }
        
        @media (max-width: 600px) {
          .search input {
            margin-right: 0;
            margin-bottom: .5em;
          }
        
          .search input,
          .search button {
            width: 100%;
          }
        }

        .but{
          position: relative;
  top: 3900px;
  left: 30px;
        }
        
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  )
}
