import { Link, useLocation, useParams } from 'react-router-dom';

import style from './ProductDetail.module.scss';
import classNames from 'classnames/bind';
import { formatNumber } from '~/components/format';
import { useEffect, useState } from 'react';
import { getProductDetail } from '~/apiServices/Product/getProductDetail';
import {
    IconCheck,
    IconCheck2,
    IconClose,
    IconMyShop1,
    IconMyShop2,
    IconMyShop3,
    IconMyShop4,
    IconPhone,
    IconPlust,
    IconStart,
} from '~/components/icon';
import Loading from '../Loading';
import DefaultPage from '../DefaultPage';
import Navigation from '~/layouts/Component/Navigation';
import { useCookies } from 'react-cookie';

const cx = classNames.bind(style);
function ProductDetail() {
    const location = useLocation();
    const { productId } = useParams();
    const [productDetail, setProductDetail] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [cookies, setCookie, removeCookie] = useCookies(['cart']);
    useEffect(() => {
        window.scrollTo(0, 0);
        async function fetch() {
            try {
                const res = await getProductDetail(productId);
                setProductDetail(res.result);
            } catch (err) {
                console.log(err);
            } finally {
                setIsLoading(false);
            }
        }
        fetch();
    }, [productId]);

    if (isLoading) {
        return <Loading />;
    }
    if (!productDetail) {
        return <DefaultPage />;
    }
    const handlerBuy = () => {
        let cartItems = [];

        if (cookies.cart) {
            cartItems = Array.isArray(cookies.cart) ? cookies.cart : [cookies.cart];
        }

        const existingProduct = cartItems.find((item) => item.id === productDetail.id);

        if (existingProduct) {
            existingProduct.so_luong += 1;
        } else {
            cartItems.push({
                id: productDetail.id,
                so_luong: 1,
            });
        }
        setCookie('cart', cartItems, { path: '/', expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) });
    };

    return (
        <div className={`container`}>
            <Navigation path={location.pathname} />
            {productDetail !== undefined ? (
                <div className={cx('top-product-detail')}>
                    <div className={`mb-30 ${cx('product')}`}>
                        <div className={cx('frame-left')}>
                            <div className={cx('img')}>
                                <img
                                    src={productDetail.hinh_anh}
                                    alt={productDetail.ten_san_pham}
                                />
                                <div className={cx('discount')}>-10%</div>
                                <div className={cx('gift')}>Mua 1 tặng 1</div>
                            </div>
                            <div className={cx('thumbs')}>
                                <div>
                                    <img src="https://i.imgur.com/XsUrVGU.png" alt="" />
                                    <span>Ảnh thực tế</span>
                                </div>
                                <div>
                                    <img src="https://i.imgur.com/n4kZbhB.png" alt="" />
                                    <span>Thông tin sản phẩm</span>
                                </div>
                                <div>
                                    <img src="https://i.imgur.com/1aYtarT.png" alt="" />
                                    <span>Phân biết thật giả</span>
                                </div>
                                <div>
                                    <img src="https://i.imgur.com/CJhRAIO.png" alt="" />
                                    <span>Hướng dẫn chọn size</span>
                                </div>
                            </div>
                        </div>
                        <div className={cx('frame-center')}>
                            <div className={cx('name')}>
                                <span>{`${productDetail.ten_san_pham} ${productDetail.ma_san_pham}`}</span>
                                <span>
                                    <IconPlust />
                                    So sánh
                                </span>
                            </div>
                            <div className={cx('start')}>
                                <span className={cx('on-start')}>
                                    <IconStart />
                                </span>
                                <span className={cx('on-start')}>
                                    <IconStart />
                                </span>
                                <span className={cx('on-start')}>
                                    <IconStart />
                                </span>
                                <span className={cx('on-start')}>
                                    <IconStart />
                                </span>
                                <span>
                                    <IconStart />
                                </span>
                                <span>{`(1 đánh giá)`}</span>
                            </div>
                            <div>
                                <span>Mã sản phẩm:</span>
                                <span>{productDetail.ma_san_pham}</span>
                            </div>
                            <div>
                                <span>Loại máy:</span>
                                <span>{productDetail.loai_may}</span>
                            </div>
                            <div>
                                <span>Đường kính:</span>
                                <span>{productDetail.duong_kinh}mm</span>
                            </div>
                            <div className={cx('inventory')}>
                                <div>
                                    <IconCheck />
                                    <span> Sẵn hàng</span>
                                </div>
                                <div className={`hiden ${cx('out-stock')}`}>
                                    <IconClose />
                                    <span> Hết hàng</span>
                                </div>
                            </div>
                            <div className={cx('promotion')}>
                                <span className={cx('title')}>Khuyến mãi</span>
                                <ul>
                                    <li>
                                        <span>
                                            <IconCheck2 />
                                        </span>
                                        <span>Giảm</span>
                                        <span className={cx('discount')}>10%</span>
                                        <span>toàn bộ thương hiệu</span>
                                        <span className={cx('text-bold')}>Longines</span>
                                        <span>từ</span>
                                        <span className={cx('text-bold')}>11.3 - 6.4.2025</span>
                                    </li>
                                    <li>
                                        <span>
                                            <IconCheck2 />
                                        </span>
                                        <span>Giảm</span>
                                        <span className={cx('discount')}>20%</span>
                                        <span>khi mua sản phẩm thứ 2 là đồng hồ</span>
                                        <Link>Casio</Link>
                                    </li>
                                    <li>
                                        <span>
                                            <IconCheck2 />
                                        </span>
                                        <span>Ưu đãi</span>
                                        <span className={cx('text-bold', 'text-upper')}>mua 1 tặng 1</span>
                                        <span>tặng đồng đến</span>
                                        <span className={cx('text-bold')}>10 triệu</span>
                                        <Link className={cx('link-here')}>{`(Xem chi tiết tại đây)`}</Link>
                                    </li>
                                    <li>
                                        <span>
                                            <IconCheck2 />
                                        </span>
                                        <span>Tặng ngay 1 trong 2 phần quà sau khi mua đồng hồ cơ</span>
                                        <span className={cx('text-bold')}>Longines</span>
                                        <span>{`(số lượng có hạn)`}</span>
                                    </li>
                                </ul>
                            </div>
                            <div className={cx('help')}>
                                <span>Tư vấn</span>
                                <div className={cx('input')}>
                                    <input placeholder="Để lại điện thoại..." />
                                    <select aria-label="Tỉnh/Thành phố">
                                        <option>Tỉnh/Thành phố</option>
                                        <option>Tỉnh/Thành phố</option>
                                        <option>Tỉnh/Thành phố</option>
                                        <option>Tỉnh/Thành phố</option>
                                        <option>Tỉnh/Thành phố</option>
                                        <option>Tỉnh/Thành phố</option>
                                    </select>
                                </div>
                                <button>Gửi</button>
                            </div>
                            <div>Khách hàng đã mua gần đây</div>
                        </div>
                        <div className={cx('frame-right')}>
                            <div className={cx('price', 'text-line')}>
                                {`giá ${formatNumber(productDetail.gia)}`}
                                <span>₫</span>
                            </div>
                            <div className={cx('promotion')}>
                                <div className={cx('title')}>giá km:</div>
                                <div className={cx('price-promotion')}>
                                    <span>{formatNumber(productDetail.gia)}</span>
                                    <span>₫</span>
                                </div>
                                <div className={cx('note-vat')}>{`(Giá trên đã bao gồm VAT)`}</div>
                            </div>
                            <Link onClick={handlerBuy} to={'/gio-hang'} className={cx('btn', 'btn-buy')}>
                                Mua ngay
                            </Link>
                            <Link className={cx('btn', 'btn-credit')}>
                                <span>Trả góp qua thẻ</span>
                                <span>{`Tín Dụng (Credit Card)`}</span>
                            </Link>
                            <Link className={cx('btn', 'btn-instruct')}>
                                <span>Hướng dẫn trả góp</span>
                                <span>Qua thẻ tín dụng</span>
                            </Link>
                            <Link className={cx('btn', 'btn-advise')}>Tư vấn miễn phí</Link>
                            <div>
                                <IconPhone />
                                <div>
                                    <span>Hoặc mua hàng qua điện thoại</span>
                                    <Link>036.7860.614</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={`mb-70 ${cx('whyMe')}`}>
                        <Link>
                            <IconMyShop1 />
                            <span>100% hàng chính hãng</span>
                        </Link>
                        <Link>
                            <IconMyShop2 />
                            <span>Miễn phí vận chuyển</span>
                        </Link>
                        <Link>
                            <IconMyShop3 />
                            <span>Bảo hành 5 năm</span>
                        </Link>
                        <Link>
                            <IconMyShop4 />
                            <span>Đổi hàng trong 7 ngày</span>
                        </Link>
                    </div>
                    <div className={cx('detail-infor')}>
                        <div>
                            <div className={cx('description')}>mô tả chi tiết</div>
                            <div className={cx('guarantee')}>bảo hành</div>
                            <div className={cx('instruction')}>
                                Hướng dẫn sử dụng
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                            </div>
                        </div>
                        <div>giấy chứng nhận</div>
                    </div>
                    <div>Mô tả đồng hồ</div>
                    <div>sản phẩm liên quan</div>
                    <div>Bình luận đánh giá</div>
                </div>
            ) : null}
        </div>
    );
}

export default ProductDetail;
