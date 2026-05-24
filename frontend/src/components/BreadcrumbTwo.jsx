import React from 'react'
import { Link } from 'react-router-dom'

const BreadcrumbTwo = () => {
    return (
        <div className="breadcrumb py-26 bg-color-one">
            <div className="container container-lg">
                <div className="breadcrumb-wrapper flex-between flex-wrap gap-16">
                    <h6 className="mb-0">Shop Details</h6>
                    <ul className="flex-align gap-8 flex-wrap">
                        <li className="text-sm">
                            <Link to="/" className="text-main-600 flex-align gap-8">
                                <i className="ph ph-house" />
                                Home
                            </Link>
                        </li>
                        <li className="flex-align text-gray-500">
                            <i className="ph ph-caret-right" />
                        </li>
                        <li className="text-sm">
                            <Link to="/shop" className="text-main-600 flex-align gap-8">

                                Shop
                            </Link>
                        </li>
                        <li className="flex-align text-gray-500">
                            <i className="ph ph-caret-right" />
                        </li>
                        <li className="text-sm">
                            <Link to="/" className="text-main-600 flex-align gap-8">
                                Shop Grid
                            </Link>
                        </li>
                        <li className="flex-align text-gray-500">
                            <i className="ph ph-caret-right" />
                        </li>
                        <li className="text-sm text-neutral-600">Lay's Potato Chips</li>
                    </ul>
                </div>
            </div>
        </div>

    )
}

export default BreadcrumbTwo