import React, { Component } from 'react';
import AccountMenuSidebar from './modules/AccountMenuSidebar';
import TableOrder from './modules/TableOrder';
import { Tabs } from 'antd';
class OrderHistory extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        const { TabPane } = Tabs;
        const accountLinks = [
            {
                text: 'Account Information',
                url: '/account/user-information',
                icon: 'icon-user',
            },
            {
                text: 'Update Password',
                url: '/account/updatePassword',
                icon: 'icon-key',
            },
            {
                text: 'Notifications',
                url: '/account/notifications',
                icon: 'icon-alarm-ringing',
            },
            {
                text: 'Invoices',
                url: '/account/invoices',
                icon: 'icon-papers',
            },
            {
                text: 'Address',
                url: '/account/addresses',
                icon: 'icon-map-marker',
            },
            {
                text: 'Order History',
                url: '/account/orderHistory',
                active: true,
                icon: 'icon-store',
            },
            {
                text: 'Wishlist',
                url: '/account/wishlist',
                icon: 'icon-heart',
            },
        ];
        return (
            <section className="ps-my-account ps-page--account">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-4">
                            <div className="ps-page__left">
                                <AccountMenuSidebar data={accountLinks} />
                            </div>
                        </div>
                        <div className="col-lg-8">
                            <div className="ps-page__content">
                                <div
                                    className="ps-section--account-setting"
                                    style={{ width: '120%' }}>
                                    <div className="ps-section__header">
                                        <h3>Order History</h3>
                                    </div>
                                    <div className="ps-section__content">
                                        <Tabs defaultActiveKey={1}>
                                            <TabPane
                                                tab="??ang Giao H??ng"
                                                key="1">
                                                <TableOrder
                                                    idRender={1000003}
                                                />
                                            </TabPane>
                                            <TabPane tab="???? giao h??ng" key="2">
                                                <TableOrder
                                                    idRender={1000005}
                                                    finishOrder={true}
                                                />
                                            </TabPane>
                                            <TabPane tab="Ch??? x??c nh???n" key="3">
                                                <TableOrder
                                                    idRender={1000004}
                                                    waitingConfirm={true}
                                                />
                                            </TabPane>
                                        </Tabs>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}

export default OrderHistory;
