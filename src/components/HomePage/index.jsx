import React, { Component, useEffect, useState } from 'react';
import { Button, Card, Container, Dimmer, Divider, Grid, Header, Icon, Image, Input, Loader, Modal, Pagination, Popup, Search } from 'semantic-ui-react';
import imageBooks from "../../assets/book.png"

const Home=()=>{

  const [books,setBooks]=useState()
  const [showBooks,setShowBooks]=useState()
  const [loadState,setLoadState]=useState(true)
  const [c,setC]=useState(10)
  const [open,setOpen]=useState(false)
  const [showCart,setShowCart]=useState([])

  useEffect( ()=>{
    fetch('http://s3-ap-southeast-1.amazonaws.com/he-public-data/books8f8fe52.json')
      .then((res) => res.json())
      .then((data) => {
        setBooks(data)
        setLoadState(false)
        setShowBooks(data.slice(0,11))
      })
  },[])


  const showStar=(count)=>{
    const li=[]
    for(let i=0;i<count;i++){
      li.push(<Icon size="large" name="star"/>)
    }
    for(let i=0;i<4-count;i++){
      li.push(<Icon name="star outline" size="large"/>)
    }
    return li
  }

  const setCount=(val)=>{
    if(val){
      let c=books.slice(0,val)
    setShowBooks(c)
    setC(val)
    }
    else{
      let c=books.slice(0,10)
      setShowBooks(c)
      setC(10)
    }
  }

  const changeData=(e,d)=>{
    console.log(parseInt(d)*c,(parseInt(d)*c)+parseInt(c))
    let data=books.slice(parseInt(d)*c,(parseInt(d)*c)+parseInt(c))
    setShowBooks(data)
  }

  const showASC=()=>{
    let b=books
    b.sort(function(a, b) {
      var keyA = a.average_rating,
        keyB = b.average_rating;
      if (keyA < keyB) return -1;
      if (keyA > keyB) return 1;
      return 0;
    });
    setShowBooks(books.slice(0,c))
  }

  const showDESC=()=>{
    let b=books
    b.sort(function(a, b) {
      var keyA = a.average_rating,
        keyB = b.average_rating;
      if (keyA > keyB) return -1;
      if (keyA < keyB) return 1;
      return 0;
    });
    setShowBooks(books.slice(0,c))
  }

  const Searching=()=>{
    let d=document.getElementById("search")
    console.log(d.value)
    if(d.value.length>0){
    let temp=[]
    setLoadState(true)
    console.log(d)
    for(let item of books){
      let str=""+item.title
      if(str.includes(d.value)){
        temp.push(item)
      }
    }
    setShowBooks(temp)
    setC(temp.length)
    setLoadState(false)
  }
  else{
    setShowBooks(books.slice(0,c))
  }
  }

  //ADDING PRODUCTS TO A CART
  const addCart=(item)=>{
    window.alert("Cart Added Successfully")
    let temp=[...showCart]
    let fl=true
    for(let i in showCart){
      if(i===item){
        console.log("ho")
        fl=false
        break
      }
    }
    if(fl){
      temp.push(item)
      setShowCart(Array.from(new Set(temp)))
    }
  }

  //REMOVING PRODUCTS FROM A CART

  const removeCart=(item)=>{
    let fi=showCart.filter((i)=>{return i!==item})
    setShowCart(fi)
  }

  if(loadState){
    return (
      <Dimmer active>
        <Loader />
      </Dimmer>
    )
  }

  return(
    <div style={{margin:'5rem'}}>
      <Container textAlign='center'><h2>ProductMania-2021</h2></Container>
      <Container textAlign='right' style={{margin:'1rem'}}
      >
        <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      style={{width:'85%'}}
      trigger={<Button><Icon name="cart"/>{showCart.length}</Button>}
    >
      <Modal.Header>Book Cart</Modal.Header>
      <Modal.Content>
      <Grid columns={3} >
        <Grid.Row>
      {showCart && showCart.length>0? showCart.map((item)=>{
            return (
              <Grid.Column>
                  <Card style={{margin:'2rem',minHeight:'500px',minWidth:'250px'}}> 
                    {/* <Icon name="book outlined"/> */}
                    <Image src={imageBooks} style={{height:'200px',width:'200px',margin: '1rem',}} wrapped={false} ui/>
                    <Card.Content>
                      <Card.Header>{item.title.slice(0,50)}<Popup style={{display:'inline'}} content={item.title} trigger={<span style={{cursor:'pointer',marginLeft:'0.5rem'}}>...</span>} /></Card.Header>
                      <Card.Meta>{item.authors}</Card.Meta>
                      <Card.Description>
                        {showStar(item.average_rating)}
                      </Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                      <a>
                        <Icon name='user' />
                        {item.ratings_count} users Rated 
                      </a>
                      <br/>
                      <Button onClick={()=>{removeCart(item)}}  negative style={{margin:'1rem'}}><Icon name="close"/></Button>
                    </Card.Content>
                  </Card>
              </Grid.Column>
            )
         }):<h3 style={{textAlign:'center',margin:'1rem'}}>No Books Available inside cart</h3>}
    </Grid.Row>
    {/* <Container style={{margin:'2rem'}} textAlign="center"><Pagination onPageChange={(e,data)=>{changeData(e,data.activePage)}} defaultActivePage={5} totalPages={parseInt((books&&books.length)/c)} /></Container> */}
        </Grid>
        
      </Modal.Content>
      <Modal.Actions>
        <Button
          content="Cancel"
          labelPosition='right'
          onClick={() => setOpen(false)}
        />
      </Modal.Actions>
    </Modal>
         <Button.Group size='large' style={{margin:'1rem'}}>
          <Button onClick={showASC} positive><Icon name="arrow circle up"/></Button>
          <Button disabled>Rating</Button>
          <Button onClick={showDESC} negative><Icon name="arrow circle down"/></Button>
        </Button.Group>
      <Input onChange={(e)=>{setCount(e.target.value)}}  style={{marginRight:'.5rem'}} placeholder="Count of Books to show "/>
      <Input style={{width:'250px'}} loading={loadState} id="search" icon='book' iconPosition='left' placeholder='Search Book Name' />
      <Button style={{margin:'1rem'}} positive onClick={Searching}><Icon name="search"/></Button>
      </Container>
      <Container fluid>
      <Container textAlign='left'><h2>Available Books [{books&&books.length}] :</h2></Container>
        <Grid columns={4} >
        <Grid.Row>
      {showBooks && showBooks.map((item)=>{
            return (
              <Grid.Column>
                  <Card style={{margin:'2rem',minHeight:'500px',minWidth:'250px'}}> 
                    {/* <Icon name="book outlined"/> */}
                    <Image src={imageBooks} style={{height:'230px',width:'230px',margin: '1rem',}} wrapped={false} ui/>
                    <Card.Content>
                      <Card.Header>{item.title.slice(0,50)}<Popup style={{display:'inline'}} content={item.title} trigger={<span style={{cursor:'pointer',marginLeft:'0.5rem'}}>...</span>} /></Card.Header>
                      <Card.Meta>{item.authors}</Card.Meta>
                      <Card.Description>
                        {showStar(item.average_rating)}
                      </Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                      <a>
                        <Icon name='user' />
                        {item.ratings_count} users Rated 
                      </a>
                      <br/>
                      <Button onClick={()=>{addCart(item)}} positive style={{margin:'1rem'}}><Icon name="cart plus"/></Button>
                    </Card.Content>
                  </Card>
              </Grid.Column>
            )
         })}
    </Grid.Row>
    <Container style={{margin:'2rem'}} textAlign="center"><Pagination onPageChange={(e,data)=>{changeData(e,data.activePage)}} defaultActivePage={5} totalPages={parseInt((books&&books.length)/c)} /></Container>
        </Grid>
         
      </Container>
    </div>
  )
}

export default Home