import React from 'react'

const NewsletterTwo = () => {
    return (
        <div className="newsletter-two bg-neutral-600 py-32">
            <div className="container container-lg">
                <div className="flex-between gap-20 flex-wrap">
                    <div className="flex-align gap-22">
                        <span className="d-flex">
                            <img src="/assets/images/icon/envelop.png" alt="" />
                        </span>
                        <div>
                            <h5 className="text-white mb-12 fw-medium">
                                Join Our Newsletter, Get 10% Off
                            </h5>
                            <p className="text-white fw-light">
                                Get all latest information on events, sales and offer
                            </p>
                        </div>
                    </div>
                    <form action="#" className="newsletter-two__form w-50">
                        <div className="flex-align gap-16">
                            <input
                                type="text"
                                className="common-input style-two rounded-8 flex-grow-1 py-14"
                                placeholder="Enter your email address"
                            />
                            <button
                                type="submit"
                                className="btn btn-main-two flex-shrink-0 rounded-8 py-16"
                            >
                                {" "}
                                Subscribe
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

    )
}

export default NewsletterTwo