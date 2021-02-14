/* eslint-disable no-unused-vars */
import React, {useState, useEffect, useCallback, useRef} from 'react';
import styled from "styled-components";
import axios from 'axios';

const App = () => {

  const [page, setPage] = useState(1);
  const [games, setGames] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadMore, setLoadMore] = useState(true);
  const observer = useRef();

  useEffect(() => {
    setIsLoading(true);
    let fetchGames = async() => {
      try {
        const response = await axios.get(`http://localhost:5000/game?page=${page}&count=10`)
        if(response.data.games.length === 0)
        setLoadMore(false)
        setGames(prevGames => [...prevGames , ...response.data.games])
      }catch(err){
        console.log(err)
      }
      setIsLoading(false);
    }
    fetchGames()
  }, [page])


  const lastItem = useCallback((element) => {
    if(observer.current) {
      observer.current.disconnect();
    }
    observer.current = new IntersectionObserver((entries) => {
      if(entries[0].isIntersecting && loadMore){
        setPage(prevPage => prevPage + 1);
      }
    }, {threshold: 1});

    if(element){
      observer.current.observe(element);
    }
  }, [loadMore])

  const items = games.map((el, index) => {
    if(games.length === index + 1){
      return <Item key = {el._id} ref = {lastItem}>{el.game}</Item>
    }else{
      return <Item key = {el._id}>{el.game}</Item>
    }
  })


  return (
    <Container>
        {items}
        {isLoading ? <Loading>Loading...</Loading>: null}
    </Container>
  );
}

export default App;

const Container = styled.div`
  margin: 0px auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 25%;
`

const Item = styled.div`
height: 120px;
width: 100%;
display: flex;
justify-content: center;
align-items: center;
border-bottom: 1px solid rgba(0,0,0,0.3);
`

const Loading = styled.div`
width: 100%;
font-size: 20px;
background-color: red;
text-align: center;
`