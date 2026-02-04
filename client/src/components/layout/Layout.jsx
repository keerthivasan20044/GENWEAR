import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Navbar from './Navbar';
import Footer from './Footer';
import 'react-toastify/dist/ReactToastify.css';

function Layout() {
    const location = useLocation();
    const isHome = location.pathname === '/';

    return (
        <div className="flex flex-col min-h-screen relative overflow-hidden bg-slate-50">
            <Navbar transparent={isHome} />
            <main className="flex-grow pt-20 lg:pt-24">
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
    );
}

export default Layout;
