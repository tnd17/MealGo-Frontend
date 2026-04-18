import React, { useContext } from 'react'
import './ExploreMenu.css'
import { categoryImages } from '../../assets/assets'
import { StoreContext } from '../../context/StoreContext'

const ExploreMenu = ({category,setCategory}) => {

  const {menu_list} = useContext(StoreContext);

  return (
    <div className='explore-menu' id='explore-menu'>
      <h1>Explore our menu</h1>
      <p className='explore-menu-text'>Choose from a diverse menu featuring a delectable array of dishes. Our mission is to satisfy your cravings and elevate your dining experience, one delicious meal at a time.</p>
      <div className="explore-menu-list">
        {menu_list.map((item, index)=>{
            return (
                <div onClick={()=>setCategory(prev=>prev===item.name?"All":item.name)} key={item.id} className='explore-menu-list-item'>
                    <img className={category===item.name?"active":""} src={categoryImages[item.name]} alt="" />
                    <p>{item.name}</p>
                </div>
            )
        })}
      </div>
      <hr />
    </div>
  )
}

export default ExploreMenu
