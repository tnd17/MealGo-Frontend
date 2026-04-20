import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../config/api";
import { StoreContext } from "./storeContext";

const StoreContextProvider = (props) => {

    const [cartItems,setCartItems] = useState({});
    const [food_list,setFoodList] = useState([]);
    const [menu_list,setMenuList] = useState([]);

    const fetchFoods = async () => {
        try {
            const response = await axios.get(`${API_URL}/foods`);
            setFoodList(response.data);
        } catch (error) {
            console.error("Error fetching foods:", error);
        }
    }

    const fetchCategories = async () => {
        try{
            const response = await axios.get(`${API_URL}/categories`);
            setMenuList(response.data);
        } catch(error){
            console.error(error);
        }
    } 

    useEffect(()=>{ 
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchFoods();
        fetchCategories();
    },[]);

    const addToCart = (itemId) => {
        if(!cartItems[itemId]){
            setCartItems((prev)=>({...prev,[itemId]:1}))
        }
        else{
            setCartItems((prev)=>({...prev,[itemId]:prev[itemId]+1}))
        }
    }

    // const removeFromCart = (itemId) => {
    //     setCartItems((prev)=>({...prev,[itemId]:prev[itemId]-1}))
    // }

    const removeFromCart = (itemId) => {
        setCartItems((prev) => ({
            ...prev,
    
            // nếu chưa có thì =0
            // trừ ra âm thì lấy max là 0
            [itemId]: Math.max((prev[itemId] || 0) - 1, 0)
        }));
    }

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for(const item in cartItems){
            if(cartItems[item] > 0){
                let itemInfo = food_list.find((product) => String(product.id) === String(item));
                if(itemInfo) {
                    totalAmount += itemInfo.price * cartItems[item];
                }
            }
        }
        return totalAmount;
    }

    const clearCart = () => {
        setCartItems({});
    }

    const contextValue = {
        food_list,
        menu_list,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        clearCart
    }
    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )
}

export default StoreContextProvider;