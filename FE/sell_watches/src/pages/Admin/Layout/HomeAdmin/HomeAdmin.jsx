import classNames from 'classnames/bind';
import style from './HomeAdmin.module.scss';
import { useEffect, useState, useMemo } from 'react';
import { BarChart, LineChart, PieChart } from '@mui/x-charts';
import { formatDateDashboard, formatNumber } from '~/components/format';
import { postDashboardTop } from '~/apiServices/Dashboard/postDashboardTop';
import { postDashboardBottom } from '~/apiServices/Dashboard/postDashboardBottom';
import {
    IconCalendar,
    IconTruck,
    IconCreditCard,
    IconStore,
    IconUser,
} from '~/components/icon';

const cx = classNames.bind(style);

function HomeAdmin() {
    const [endDayTop, setEndDayTop] = useState(new Date());
    const initialStartDayTop = new Date(endDayTop);
    initialStartDayTop.setDate(endDayTop.getDate() - 6);
    const [startDayTop, setStartDayTop] = useState(initialStartDayTop);

    const [endDayBottom, setEndDayBottom] = useState(new Date());
    const initialStartDayBottom = new Date(endDayBottom);
    initialStartDayBottom.setDate(endDayBottom.getDate() - 30);
    const [startDayBottom, setStartDayBottom] = useState(initialStartDayBottom);

    const [daysTop, setDaysTop] = useState([]);
    const [daysBottom, setDaysBottom] = useState([]);

    const [dashboardTopDay, setDashboardTopDay] = useState({ startDay: null, endDay: null });
    const [dashboardBottomDay, setDashboardBottomDay] = useState({ startDay: null, endDay: null });

    const [resultProduct, setResultProduct] = useState(null);
    const [resultRevenue, setResultRevenue] = useState(null);
    const [resultPayment, setResultPayment] = useState(null);
    const [resultOrder, setResultOrder] = useState(null);
    const [getTimeNow, setGetTimeNow] = useState();

    useEffect(() => {
        const currentTime = new Date();
        const hours = String(currentTime.getHours()).padStart(2, '0');
        const minutes = String(currentTime.getMinutes()).padStart(2, '0');
        const seconds = String(currentTime.getSeconds()).padStart(2, '0');
        setGetTimeNow(`${hours}:${minutes}:${seconds}`);
    }, []);

    useEffect(() => {
        if (getTimeNow) {
            setDashboardTopDay({
                startDay: formatDateDashboard(startDayTop),
                endDay: formatDateDashboard(endDayTop) + ' ' + getTimeNow,
            });
            setDashboardBottomDay({
                startDay: formatDateDashboard(startDayBottom),
                endDay: formatDateDashboard(endDayBottom) + ' ' + getTimeNow,
            });
        }
    }, [startDayTop, endDayTop, startDayBottom, endDayBottom, getTimeNow]);

    useEffect(() => {
        setDaysTop(getDaysBetween(startDayTop, endDayTop));
        setDaysBottom(getDaysBetween(startDayBottom, endDayBottom));
    }, [endDayBottom, endDayTop, startDayBottom, startDayTop]);

    useEffect(() => {
        if (getTimeNow && dashboardTopDay.startDay && dashboardTopDay.endDay) {
            async function fetchTop() {
                try {
                    const res = await postDashboardTop(dashboardTopDay);
                    processProductData(res.productResponse);
                    processRevenueData(res.productSell);
                    processOrderData(res.orderResponse);
                } catch (err) {
                    console.log(err);
                }
            }
            fetchTop();
        }
    }, [dashboardTopDay]);

    useEffect(() => {
        if (getTimeNow && dashboardBottomDay.startDay && dashboardBottomDay.endDay) {
            async function fetchBottom() {
                try {
                    const res = await postDashboardBottom(dashboardBottomDay);
                    processPaymentData(res.paymentResponse);
                } catch (err) {
                    console.log(err);
                }
            }
            fetchBottom();
        }
    }, [dashboardBottomDay]);

    const getDaysBetween = (startDate, endDate) => {
        const days = [];
        let start = new Date(startDate);
        let end = new Date(endDate);
        if (start > end) [start, end] = [end, start];
        for (let dt = new Date(start); dt <= end; dt.setDate(dt.getDate() + 1)) {
            const day = dt.getDate().toString().padStart(2, '0');
            const month = (dt.getMonth() + 1).toString().padStart(2, '0');
            days.push(`${day}/${month}`);
        }
        return days;
    };

    const processProductData = (data) => {
        if (!data) return;
        const totalSuccess = data.productSuccess.reduce((sum, item) => sum + item.data, 0);
        const totalReturn = data.productReturn.reduce((sum, item) => sum + item.data, 0);
        const successData = [];
        const returnData = [];

        for (let dt = new Date(startDayTop); dt <= endDayTop; dt.setDate(dt.getDate() + 1)) {
            const foundSuccess = data.productSuccess.find((item) => item.day === formatDateDashboard(dt));
            const foundReturn = data.productReturn.find((item) => item.day === formatDateDashboard(dt));
            successData.push(foundSuccess ? foundSuccess.data : 0);
            returnData.push(foundReturn ? foundReturn.data : 0);
        }

        setResultProduct({
            success: { productData: successData, total: totalSuccess },
            return: { productData: returnData, total: totalReturn },
        });
    };

    const processRevenueData = (data) => {
        if (!data) return;
        const giaBan = data.productSell.reduce((sum, { soLuong, giaBan }) => sum + soLuong * giaBan, 0);
        const revenue = Number(giaBan) - Number(data.giaNhap);
        setResultRevenue({
            totalImportPrice: data.giaNhap,
            totalSellingPrice: giaBan,
            revenue,
        });
    };

    const processOrderData = (data) => {
        if (!data) return;
        const totalAccept = data.orderAccept.reduce((sum, item) => sum + item.data, 0);
        const totalCancel = data.orderCancel.reduce((sum, item) => sum + item.data, 0);
        const acceptData = [];
        const cancelData = [];

        for (let dt = new Date(startDayTop); dt <= endDayTop; dt.setDate(dt.getDate() + 1)) {
            const foundAccept = data.orderAccept.find((item) => item.day === formatDateDashboard(dt));
            const foundCancel = data.orderCancel.find((item) => item.day === formatDateDashboard(dt));
            acceptData.push(foundAccept ? foundAccept.data : 0);
            cancelData.push(foundCancel ? foundCancel.data : 0);
        }

        setResultOrder({
            accept: { productData: acceptData, total: totalAccept },
            cancel: { productData: cancelData, total: totalCancel },
        });
    };

    const processPaymentData = (data) => {
        if (!data) return;
        const totalPayment = data.reduce((sum, item) => sum + Number(item.data), 0);
        const paymentData = [];

        for (let dt = new Date(startDayBottom); dt <= endDayBottom; dt.setDate(dt.getDate() + 1)) {
            const found = data.find((item) => {
                const itemDay = String(item.day).split(' ')[0];
                const fmt = formatDateDashboard(dt);
                return itemDay === fmt;
            });
            paymentData.push(found ? Number(found.data) : 0);
        }

        setResultPayment({ paymentData, total: totalPayment });
    };

    const profitMargin = useMemo(() => {
        if (!resultRevenue || resultRevenue.totalSellingPrice === 0) return 0;
        return Math.round((resultRevenue.revenue / resultRevenue.totalSellingPrice) * 100);
    }, [resultRevenue]);

    const kpiCards = [
        {
            label: 'Sản phẩm đã bán',
            value: resultProduct?.success.total ?? 0,
            icon: <IconStore />,
            iconClass: 'iconBlue',
            badge: '7 ngày gần nhất',
            badgeType: 'neutral',
            color: '#2563eb',
        },
        {
            label: 'Sản phẩm hoàn trả',
            value: resultProduct?.return.total ?? 0,
            icon: <IconTruck />,
            iconClass: 'iconRed',
            badge: '7 ngày gần nhất',
            badgeType: 'negative',
            color: '#dc2626',
        },
        {
            label: 'Đơn hàng thành công',
            value: resultOrder?.accept.total ?? 0,
            icon: <IconCreditCard />,
            iconClass: 'iconGreen',
            badge: '7 ngày gần nhất',
            badgeType: 'positive',
            color: '#059669',
        },
        {
            label: 'Đơn hàng hủy',
            value: resultOrder?.cancel.total ?? 0,
            icon: <IconUser />,
            iconClass: 'iconOrange',
            badge: '7 ngày gần nhất',
            badgeType: 'negative',
            color: '#d97706',
        },
    ];

    return (
        <div className={cx('homeAdmin')}>
            {/* HEADER */}
            <div className={cx('header')}>
                <div className={cx('titleSection')}>
                    <h2 className={cx('title')}>Bảng điều khiển</h2>
                    <p className={cx('subtitle')}>Xem tổng quan hoạt động kinh doanh của bạn</p>
                </div>
                <div className={cx('dateRangeWrapper')}>
                    <IconCalendar />
                    <input
                        type="date"
                        value={formatDateDashboard(startDayTop)}
                        onChange={(e) => {
                            const d = new Date(e.target.value);
                            setStartDayTop(d);
                        }}
                        max={formatDateDashboard(endDayTop)}
                    />
                    <span className={cx('separator')}>—</span>
                    <input
                        type="date"
                        value={formatDateDashboard(endDayTop)}
                        onChange={(e) => {
                            const d = new Date(e.target.value);
                            setEndDayTop(d);
                        }}
                    />
                </div>
            </div>

            {/* KPI CARDS */}
            <div className={cx('kpiGrid')}>
                {kpiCards.map((kpi, idx) => (
                    <div key={idx} className={cx('kpiCard')}>
                        <div className={cx('kpiIconWrapper', kpi.iconClass)}>{kpi.icon}</div>
                        <div className={cx('kpiLabel')}>{kpi.label}</div>
                        <div className={cx('kpiValue')} style={{ color: kpi.color }}>
                            {kpi.value.toLocaleString('vi-VN')}
                        </div>
                        <div className={cx('kpiFooter')}>
                            <span className={cx('kpiPeriod')}>{kpi.badge}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* CHARTS ROW */}
            <div className={cx('chartsGrid')}>
                {/* Bar chart: Sản phẩm bán vs hoàn trả */}
                <div className={cx('chartCard')}>
                    <div className={cx('chartHeader')}>
                        <h3 className={cx('chartTitle')}>Sản phẩm bán & hoàn trả</h3>
                        <span className={cx('chartBadge')}>Theo ngày</span>
                    </div>
                    <div className={cx('chartLegend')}>
                        <div className={cx('legendItem')}>
                            <span className={cx('legendDot')} style={{ backgroundColor: '#2563eb' }} />
                            Đã bán
                        </div>
                        <div className={cx('legendItem')}>
                            <span className={cx('legendDot')} style={{ backgroundColor: '#dc2626' }} />
                            Hoàn trả
                        </div>
                    </div>
                    {daysTop.length > 0 &&
                        resultProduct &&
                        resultProduct.success?.productData?.length === daysTop.length && (
                            <BarChart
                                series={[
                                    { data: resultProduct.success.productData, label: 'Đã bán', color: '#2563eb' },
                                    { data: resultProduct.return.productData, label: 'Hoàn trả', color: '#dc2626' },
                                ]}
                                height={260}
                                xAxis={[{ data: daysTop, scaleType: 'band' }]}
                                margin={{ top: 10, bottom: 30, left: 50, right: 10 }}
                                slotProps={{
                                    legend: { hidden: true },
                                }}
                            />
                        )}
                </div>

                {/* Pie chart: Doanh thu */}
                <div className={cx('chartCard')}>
                    <div className={cx('chartHeader')}>
                        <h3 className={cx('chartTitle')}>Doanh thu & chi phí</h3>
                        <span className={cx('chartBadge')}>
                            Lợi nhuận {profitMargin}%
                        </span>
                    </div>
                    {resultRevenue && (
                        <PieChart
                            series={[
                                {
                                    data: [
                                        {
                                            id: 0,
                                            value: Number(resultRevenue.totalImportPrice) || 1,
                                            label: 'Chi phí nhập',
                                            color: '#94a3b8',
                                        },
                                        {
                                            id: 1,
                                            value: Math.max(Number(resultRevenue.revenue), 1),
                                            label: 'Lợi nhuận',
                                            color: '#059669',
                                        },
                                    ],
                                },
                            ]}
                            width={420}
                            height={220}
                            slotProps={{
                                legend: { hidden: false },
                            }}
                        />
                    )}
                    <div className={cx('revenueGrid')} style={{ marginTop: '16px' }}>
                        {[
                            {
                                label: 'Chi phí nhập hàng',
                                value: formatNumber(resultRevenue?.totalImportPrice ?? 0) + 'đ',
                                bg: '#f1f5f9',
                                color: '#64748b',
                            },
                            {
                                label: 'Doanh thu bán hàng',
                                value: formatNumber(resultRevenue?.totalSellingPrice ?? 0) + 'đ',
                                bg: '#dcfce7',
                                color: '#059669',
                            },
                            {
                                label: 'Lợi nhuận',
                                value: formatNumber(resultRevenue?.revenue ?? 0) + 'đ',
                                bg: resultRevenue?.revenue >= 0 ? '#dcfce7' : '#fee2e2',
                                color: resultRevenue?.revenue >= 0 ? '#059669' : '#dc2626',
                            },
                        ].map((item, idx) => (
                            <div key={idx} className={cx('revenueItem')}>
                                <span className={cx('revenueLabel')} style={{ color: '#475569' }}>
                                    {item.label}
                                </span>
                                <span
                                    className={cx('revenueAmount')}
                                    style={{ color: item.color, fontSize: '15px' }}
                                >
                                    {item.value}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* BOTTOM ROW */}
            <div className={cx('bottomGrid')}>
                {/* Line chart: Doanh thu theo ngày */}
                <div className={cx('chartCard')}>
                    <div className={cx('chartHeader')}>
                        <h3 className={cx('chartTitle')}>Doanh thu thanh toán</h3>
                        <span className={cx('chartBadge')}>
                            Tổng: {formatNumber(resultPayment?.total ?? 0)}đ
                        </span>
                    </div>
                    <div className={cx('chartLegend')}>
                        <div className={cx('legendItem')}>
                            <span className={cx('legendDot')} style={{ backgroundColor: '#7c3aed' }} />
                            Thanh toán
                        </div>
                    </div>
                    <div className={cx('lineChart')}>
                        {daysBottom.length > 0 &&
                            resultPayment &&
                            resultPayment.paymentData?.length === daysBottom.length && (
                                <LineChart
                                    xAxis={[{ data: daysBottom, scaleType: 'band' }]}
                                    series={[
                                        {
                                            data: resultPayment.paymentData,
                                            area: true,
                                            baseline: 'min',
                                            color: '#7c3aed',
                                        },
                                    ]}
                                    margin={{ top: 10, bottom: 30, left: 80, right: 20 }}
                                    height={280}
                                />
                            )}
                    </div>
                </div>

                {/* Thống kê nhanh */}
                <div className={cx('statBox')}>
                    <h3 className={cx('statTitle')}>
                        <IconCalendar />
                        Tổng quan đơn hàng
                    </h3>
                    <ul className={cx('statList')}>
                        <li className={cx('statItem')}>
                            <span className={cx('statLabel')}>Đơn thành công</span>
                            <span className={cx('statusBadge', 'success')}>
                                {resultOrder?.accept.total ?? 0}
                            </span>
                        </li>
                        <li className={cx('statItem')}>
                            <span className={cx('statLabel')}>Đơn bị hủy</span>
                            <span className={cx('statusBadge', 'cancel')}>
                                {resultOrder?.cancel.total ?? 0}
                            </span>
                        </li>
                        <li className={cx('statItem')}>
                            <span className={cx('statLabel')}>Tỷ lệ thành công</span>
                            <span className={cx('statValueSmall')}>
                                {resultOrder
                                    ? resultOrder.accept.total + resultOrder.cancel.total > 0
                                        ? Math.round(
                                              (resultOrder.accept.total /
                                                  (resultOrder.accept.total + resultOrder.cancel.total)) *
                                                  100,
                                          )
                                        : 0
                                    : 0}
                                %
                            </span>
                        </li>
                        <li className={cx('statItem')}>
                            <span className={cx('statLabel')}>Sản phẩm đã bán</span>
                            <span className={cx('statusBadge', 'done')}>
                                {resultProduct?.success.total ?? 0}
                            </span>
                        </li>
                        <li className={cx('statItem')}>
                            <span className={cx('statLabel')}>Sản phẩm hoàn trả</span>
                            <span className={cx('statusBadge', 'pending')}>
                                {resultProduct?.return.total ?? 0}
                            </span>
                        </li>
                        <li className={cx('statItem')}>
                            <span className={cx('statLabel')}>Tổng doanh thu</span>
                            <span
                                className={cx('statValue')}
                                style={{ color: '#059669', fontSize: '16px' }}
                            >
                                {formatNumber(resultPayment?.total ?? 0)}đ
                            </span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default HomeAdmin;
