import React from 'react'
import { Outlet } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Navbar from './Navbar'
import Footer from './Footer'
import 'react-toastify/dist/ReactToastify.css'

const Layout = () => {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <Navbar />
            
            <main className="flex-1 pt-20 lg:pt-24">
                <Outlet />
            </main>
            
            <Footer />
            
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                className="mt-16"
                toastClassName="bg-white shadow-xl border border-gray-100 rounded-2xl"
                bodyClassName="text-gray-900 font-medium"
                progressClassName="bg-gradient-to-r from-orange-500 to-red-500"
            />
        </div>
    )
}

export default Layout