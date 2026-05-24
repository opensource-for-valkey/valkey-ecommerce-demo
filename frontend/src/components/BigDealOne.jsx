import React from 'react'

const BigDealOne = () => {
    return (
        <div className="big-deal rounded-16 overflow-hidden flex-between position-relative mb-24 py-80">
            <div className="container container-lg">
                <div className="big-deal-box position-relative z-1 rounded-16 py-40 overflow-hidden">
                    <img
                        src="/assets/images/bg/big-deal-pattern.png"
                        alt=""
                        className="position-absolute inset-block-start-0 inset-inline-start-0 z-n1 w-100 h-100 cover-img"
                    />
                    <div className="row gy-4 align-items-center">
                        <div className="col-md-3 text-center d-md-block d-none">
                            <img src="/assets/images/thumbs/big-deal1.png" alt="" />
                        </div>
                        <div className="col-md-6 big-deal-box__content text-center">
                            <h4 className="mb-20 text-uppercase">WATCHES BIG DEAL</h4>
                            <p className="text-heading fw-medium">
                                Wonlex KT07 4G positioning watches
                            </p>
                        </div>
                        <div className="col-md-3 text-center d-md-block d-none">
                            <img src="/assets/images/thumbs/big-deal2.png" alt="" />
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default BigDealOne