import React, { useContext } from 'react'
import './FoodDisplay.css'
import { StoreContext } from '../../context/storeContext'
import FoodItem from '../FoodItem/FoodItem'

const FoodDisplay = ({category}) => {

    const {food_list} = useContext(StoreContext)

  return (
    <div className='food-display' id='food-display'>
      <h2>Top dishes near you</h2>
      <div className="food-display-list">
        {food_list.map((item)=>{
            if(category==="All" || category===item.category.name){
                return <FoodItem key={item.id} id={item.id} name={item.name} description={item.description} price={item.price} image={item.image_url} />
            }
        })}
      </div>
    </div>
  )
}

export default FoodDisplay
