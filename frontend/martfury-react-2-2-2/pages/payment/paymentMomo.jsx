import React, { useEffect, useState } from 'react';
import PageContainer from '~/components/layouts/PageContainer';
import Router, { useRouter } from 'next/router';
import CartRepository from '~/repositories/CartRepository';
import { notification } from 'antd';
import { ClipLoader } from 'react-spinners';
import OrderRepository from '~/repositories/OrderRepository';
import { Button } from 'antd';
const paymentMomo = ({}) => {
    const router = useRouter();
    const message = router.query.message;
    const orderId = router.query.orderId;
    const cartId = router.query.requestId;
    const [dataNoti, setDataNoti] = useState(null);
    useEffect(async () => {
        if (message === 'Successful.') {
            if (cartId) {
                const payload = [];
                const listCart = cartId.split('_');
                for (let i = 1; i < listCart.length; i++) {
                    payload.push(Number(listCart[i]));
                }
                const result = await CartRepository.deleteListCart(payload);
                if (result) {
                    notification['success']({
                        message: 'Order Success',
                    });
                }
                router.push('/');
            }
        }
        if (dataNoti === null && router.query.partnerCode) {
            const payload = {};
            payload.partnerCode = router.query.partnerCode;
            payload.orderId = router.query.orderId;
            payload.requestId = router.query.requestId;
            payload.amount = router.query.amount;
            payload.orderInfo = router.query.orderInfo;
            payload.orderType = router.query.orderType;
            payload.transId = router.query.transId;
            payload.resultCode = router.query.resultCode;
            payload.message = router.query.message;
            payload.payType = router.query.payType;
            payload.responseTime = router.query.responseTime;
            payload.extraData = router.query.extraData;
            payload.signature = router.query.signature;
            setDataNoti(payload);
            const result = await OrderRepository.addNoti(payload);
        }
    }, [message]);
    const handleDeleteOrder = async () => {
        const payload = [];
        const listOrder = orderId.split('_');
        for (let i = 1; i < listOrder.length; i++) {
            payload.push(Number(listOrder[i]));
        }
        const result = await OrderRepository.deleteListOrder(payload);
        if (result) {
            router.push('/');
        }
    };
    const handleReturnPaymentMomo = async () => {
        const payloadMomo = {};
        const listOrder = orderId.split('_');
        const orderCode = '';
        const cartCode = '';
        const listCart = cartId.split('_');
        listOrder.map((items, indexs) => {
            if (indexs !== 0) {
                if (indexs !== 1) {
                    orderCode += '_';
                }
                orderCode += items;
            }
        });
        listCart.map((items, indexs) => {
            if (indexs !== 0) {
                if (indexs !== 1) {
                    cartCode += '_';
                }
                cartCode += items;
            }
        });
        payloadMomo.orderId = orderCode;
        payloadMomo.cartId = cartCode;
        payloadMomo.amount = router.query.amount;
        payloadMomo.OrderInfor = router.query.orderInfo;
        const resultPaymentMomo = await OrderRepository.getPaymentMomoLink(
            payloadMomo
        );
        if (resultPaymentMomo) {
            router.push(resultPaymentMomo[0]);
        }
    };
    return (
        <PageContainer title="OrderStatus">
            {message === 'Successful.' ? (
                <div
                    style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        marginTop: '40px',
                        flexDirection: 'column',
                    }}>
                    <ClipLoader color="#fcb800"></ClipLoader>
                    <h4 style={{ marginTop: '30px', color: '#fcb800' }}>
                        Is Loading
                    </h4>
                </div>
            ) : (
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        flexDirection: 'column',
                        minHeight: '300px',
                        paddingTop: '30px',
                    }}>
                    <strong>Order Failed</strong>
                    <br />
                    <strong>You have not completed the payment yet!!!</strong>
                    <div
                        style={{
                            display: 'flex',
                            width: '60%',
                            alignItems: 'center',
                            justifyContent: 'space-around',
                            paddingTop: '80px',
                        }}>
                        <Button
                            style={{ width: '240px' }}
                            shape="round"
                            type="primary"
                            size="large"
                            onClick={() => handleDeleteOrder()}>
                            Return to home
                        </Button>
                        <Button
                            style={{ width: '240px' }}
                            shape="round"
                            type="primary"
                            size="large"
                            onClick={() => handleReturnPaymentMomo()}>
                            Pay Again
                        </Button>
                    </div>
                </div>
            )}
        </PageContainer>
    );
};
export default paymentMomo;
