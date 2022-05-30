import React, { useState, useEffect } from 'react'
import List from './List'
import Alert from './Alert'

const getLocalStorage = ()=> {
  let list = localStorage.getItem('list');
  if (list){
    return  JSON.parse(localStorage.getItem('list'))
  } else {
    return []
  }
}

function App() {
  const [name, setName]= useState('');
  const [list, setList] = useState(getLocalStorage)
  const [isEditing, setIsEditing]= useState(false)
  const [editId, setEditId]=useState(null)
  const [alert, setAlert]=useState({
    show: false,
    msg: '',
    type: ''
  })

  const showAlert = (show = false, type = '', msg = '') => {
    setAlert({ show, type, msg })
  }

  const handleSubmit = (e)=>{
    e.preventDefault()
    if(!name){
      showAlert(true, 'danger', 'Please enter value')
    } else if (name && isEditing) {
      setList(
        list.map((item) => {
          if (item.id === editId) {
            return { ...item, title: name }
          }
          return item
        })
      )
      setName('')
      setEditId(null)
      setEditId(false)
      showAlert(true,'success', 'Value changed')
    } else {
      showAlert(true, 'success', 'Item added to the List')
      const newItem = {id: new Date().getTime().toString(),
      title: name}
      setList([...list, newItem])
      setName('')
    }
  }

  const clearItems = ()=>{
    showAlert(true,'danger','All Items deleted')
    setList([])
  }

  const removeItem = (id) => {
    showAlert(true, 'danger', 'Items remove')
    setList(list.filter(item=> item.id !== id))
  }

  const editItem = (id) => {
    const item = list.find(item=> item.id === id);
    setIsEditing(true)
    setEditId(id)
    setName(item.title)
  }

  useEffect(()=>{
    localStorage.setItem('list', JSON.stringify(list))
  }, [list])

  return (
    <section className='section-center'>
      <form className='grocery-form' onSubmit={handleSubmit}>
        {alert.show && <Alert {...alert} removeAlert={showAlert} list={list} />}
        <h3>Grocery bud</h3>
        <div className='form-control'>
          <input
            type='text'
            className='grocery'
            placeholder='e.g eggs'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button type='submit' className='submit-btn'>
            {isEditing ? 'Edit' : 'Submit'}
          </button>
        </div>
      </form>
      {list.length > 0 && (
        <div className='grocery-container'>
          <List
          items={list}
          removeItem={removeItem}
          editItem={editItem} />
          <button className='clear-btn' onClick={clearItems}>
            Clear items
          </button>
        </div>
      )}
    </section>
  )
}

export default App
