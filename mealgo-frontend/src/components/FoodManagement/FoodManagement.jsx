import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { API_URL } from '../../config/api'
import './FoodManagement.css'
import { foodImages } from '../../assets/assets'
import { StoreContext } from '../../context/storeContext'

const FoodManagement = () => {

    const { fetchFoods } = useContext(StoreContext)

    const [foods, setFoods] = useState([])
    const [categories, setCategories] = useState([])

    const [search, setSearch] = useState("")
    const [filterCategory, setFilterCategory] = useState("")

    const [showModal, setShowModal] = useState(false)

    const [editingFoodId, setEditingFoodId] = useState(null)

    const [form, setForm] = useState({
        name: "",
        description: "",
        price: "",
        categoryId: ""
    })

    const [image, setImage] = useState(null)

    // =========================
    // LOAD DATA
    // =========================
    const loadFoods = async () => {
        const res = await axios.get(`${API_URL}/foods`)
        setFoods(res.data)
    }

    const loadCategories = async () => {
        const res = await axios.get(`${API_URL}/categories`)
        setCategories(res.data)
    }

    useEffect(() => {
        loadFoods()
        loadCategories()
    }, [])

    // =========================
    // OPEN ADD MODAL
    // =========================
    const openAddModal = () => {
        setEditingFoodId(null)

        setForm({
            name: "",
            description: "",
            price: "",
            categoryId: ""
        })

        setImage(null)
        setShowModal(true)
    }

    // =========================
    // OPEN EDIT MODAL
    // =========================
    const openEditModal = (food) => {
        setEditingFoodId(food.id)

        setForm({
            name: food.name,
            description: food.description,
            price: food.price,
            categoryId: food.category?.id
        })

        setShowModal(true)
    }

    // =========================
    // ADD / UPDATE FOOD
    // =========================
    const handleSubmitFood = async () => {
        if (image && image.size > 5 * 1024 * 1024) {
            alert("Image must be smaller than 5MB")
            return
        }
        const data = new FormData()

        data.append("name", form.name)
        data.append("description", form.description)
        data.append("price", form.price)
        data.append("categoryId", form.categoryId)

        if (image) {
            data.append("image", image)
        }

        if (editingFoodId) {
            // update food
            await axios.put(
                `${API_URL}/foods/${editingFoodId}`,
                data
            )
            alert("Food updated successfully")
        } else {
            // add food
            await axios.post(
                `${API_URL}/foods`,
                data
            )
            alert("Food added successfully")
        }

        setShowModal(false)
        loadFoods()
        fetchFoods()
    }

    // =========================
    // DELETE FOOD
    // =========================
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure to delete this food?"
        )

        if (!confirmDelete) return

        await axios.delete(`${API_URL}/foods/${id}`)
        loadFoods()
        fetchFoods()
    }

    // =========================
    // SEARCH FOOD
    // =========================
    const handleSearch = async () => {
        if (!search.trim()) {
            loadFoods()
            return
        }

        const res = await axios.get(
            `${API_URL}/foods/search?keyword=${search}`
        )

        setFoods(res.data)
    }

    // =========================
    // FILTER CATEGORY
    // =========================
    const handleFilter = async (categoryId) => {
        if (!categoryId) {
            loadFoods()
            return
        }

        const res = await axios.get(
            `${API_URL}/foods/category/${categoryId}`
        )

        setFoods(res.data)
    }

    // =========================
    // FIX IMAGE URL
    // =========================

    const getImageUrl = (imageUrl) => {
        if (!imageUrl) {
            return "https://via.placeholder.com/80"
        }
    
        // ảnh upload từ backend
        if (imageUrl.startsWith("/uploads")) {
            return `http://localhost:8080${imageUrl}`
        }
    
        // ảnh local từ assets.js
        return foodImages[imageUrl]
    }

    return (
        <div className='food-management'>

            {/* top header */}
            <div className='food-header'>
                <h1>Food Management</h1>

                <button
                    className='add-food-btn'
                    onClick={openAddModal}
                >
                    + Add Food
                </button>
            </div>

            {/* search + filter */}
            <div className="food-tools">

                <input
                    placeholder="Search food..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <button
                    className="search-btn"
                    onClick={handleSearch}
                >
                    Search
                </button>

                <select
                    value={filterCategory}
                    onChange={(e) => {
                        setFilterCategory(e.target.value)
                        handleFilter(e.target.value)
                    }}
                >
                    <option value="">All Categories</option>

                    {categories.map(c => (
                        <option key={c.id} value={c.id}>
                            {c.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* table */}
            <table className='food-table'>
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Category</th>
                        <th>Action</th>
                    </tr>
                </thead>

                <tbody>
                    {foods.map(food => (
                        <tr key={food.id}>
                            <td>
                                <img
                                    src={getImageUrl(food.image_url)}
                                    width="80"
                                    alt={food.name}
                                />
                            </td>

                            <td>{food.name}</td>
                            <td>${food.price}</td>
                            <td>{food.category?.name}</td>

                            <td>
                                <button
                                    className='edit-btn'
                                    onClick={() => openEditModal(food)}
                                >
                                    Edit
                                </button>

                                <button
                                    className='delete-btn'
                                    onClick={() => handleDelete(food.id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* popup modal */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="food-modal">

                        <h2>
                            {editingFoodId
                                ? "Edit Food"
                                : "Add Food"}
                        </h2>

                        <input
                            placeholder="Food name"
                            value={form.name}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    name: e.target.value
                                })
                            }
                        />

                        <input
                            placeholder="Description"
                            value={form.description}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    description: e.target.value
                                })
                            }
                        />

                        <input
                            type="number"
                            placeholder="Price"
                            value={form.price}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    price: e.target.value
                                })
                            }
                        />

                        <select
                            value={form.categoryId}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    categoryId: e.target.value
                                })
                            }
                        >
                            <option value="">
                                Select category
                            </option>

                            {categories.map(c => (
                                <option
                                    key={c.id}
                                    value={c.id}
                                >
                                    {c.name}
                                </option>
                            ))}
                        </select>

                        <input
                            type="file"
                            onChange={(e) =>
                                setImage(e.target.files[0])
                            }
                        />

                        <div className="modal-actions">
                            <button
                                className='save-btn'
                                onClick={handleSubmitFood}
                            >
                                Save
                            </button>

                            <button
                                className='cancel-btn'
                                onClick={() =>
                                    setShowModal(false)
                                }
                            >
                                Cancel
                            </button>
                        </div>

                    </div>
                </div>
            )}

        </div>
    )
}

export default FoodManagement