import classNames from 'classnames/bind';
import style from './Home.module.scss';
import { banner_img, imgWhyMe, listTrademark } from '~/assets';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { IconGoTop, IconMyShop1, IconMyShop2, IconMyShop3, IconMyShop4 } from '~/components/icon';
import { getListProductsHome } from '~/apiServices/Product/getListProductsHome';
import Products from '~/layouts/Component/Product';

const cx = classNames.bind(style);
function Home() {
    // time banner
    const [isVisibleBanner, setIsVisibleBanner] = useState(0);
    // set create text
    const [delay, setDelay] = useState(10000);
    const [delayText, setDelayText] = useState(500);
    const lenghObjBanner = Object.keys(banner_img).length;
    const stringTextIntro = '70 năm kinh nghiệm về đồng hồ';
    const [displayedIndex, setDisplayedIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);

    // product
    const [listProduct, setListProducts] = useState();
    const [productsNew, setProductNew] = useState();
    const [productsQua, setProductQua] = useState();
    const [activeTypeProductNew, setActiveTypeProductNew] = useState('dong-ho-nam');
    const [activeTypeProductQua, setActiveTypeProductQua] = useState('dong-ho-nam');
    useEffect(() => {
        async function fetchGetProducts() {
            try {
                const res = await getListProductsHome();
                setListProducts(res.result);
                setProductNew(res.result['newNam']);
                setProductQua(res.result['quaNam']);
            } catch (err) {
                console.log(err);
            }
        }
        fetchGetProducts();
    }, []);
    useEffect(() => {
        const interval = setInterval(() => {
            if (!isDeleting) {
                if (displayedIndex < stringTextIntro.length) {
                    setDisplayedIndex((prev) => prev + 1);
                } else {
                    setTimeout(() => {
                        setIsDeleting(true);
                        setDelayText(100);
                    }, delayText * 5);
                }
            } else {
                if (displayedIndex > 0) {
                    setDisplayedIndex((prev) => prev - 1);
                } else {
                    setTimeout(() => {
                        setIsDeleting(false);
                        setDelayText(500);
                    }, delayText * 5);
                }
            }
        }, delayText);
        return () => clearInterval(interval);
    }, [displayedIndex, isDeleting, stringTextIntro, delayText]);
    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         setIsVisibleBanner((prev) => (prev + 1) % lenghObjBanner);
    //     }, delay);
    //     return () => clearInterval(interval);
    // }, [lenghObjBanner]);

    const getTypeProductNew = (type, index) => {
        setProductNew(listProduct[type]);
        setActiveTypeProductNew(index);
    };
    const getTypeProductQua = (type, index) => {
        setProductQua(listProduct[type]);
        setActiveTypeProductQua(index);
    };
    return (
        <div className="HomePage">
            <a href="/#" className={cx('goTop')}>
                <IconGoTop />
            </a>
            <div className={cx('banner')}>
                {Object.keys(banner_img).map((value, index) => (
                    <Link key={index} to={value}>
                        <img
                            className={index === isVisibleBanner ? cx('active') : ''}
                            src={banner_img[value]}
                            alt={`banner ${index}`}
                        />
                    </Link>
                ))}
            </div>
            <div className={cx('introduce')}>
                <img src="https://i.imgur.com/6aB8jrC.jpg" alt=""></img>
                <div className={cx('text_container')}>
                    <div className={cx('text')}>
                        <span>Duy anh - </span>
                        <span>{stringTextIntro.substring(0, displayedIndex)}</span>
                        <span className={cx('lineText')}>|</span>
                    </div>
                </div>
                <div className={cx('inner')}>
                    <div className={`container ${cx('inner_')}`}>
                        <div>
                            <div>
                                <img src="https://i.imgur.com/bhFgxYo.png" alt="" />
                            </div>
                            <div className={cx('inner_text')}>
                                <span className={cx('title')}>Phòng bảo hành đạt</span>
                                <span className={cx('summary')}>Tiêu chuẩn thụy sỹ</span>
                            </div>
                        </div>
                        <div>
                            <div>
                                <img src="https://i.imgur.com/SswrpRG.png" alt="" />
                            </div>

                            <div className={cx('inner_text')}>
                                <span className={cx('title')}>Thương hiệu uy tín</span>
                                <span className={cx('summary')}>Lâu đời 70 năm</span>
                            </div>
                        </div>
                        <div>
                            <div>
                                <img src="https://i.imgur.com/hPmGGJx.png" alt="" />
                            </div>
                            <div className={cx('inner_text')}>
                                <span className={cx('title')}>Đền 20 lần nếu bán</span>
                                <span className={cx('summary')}>hàng fake</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={`container ${cx('mt-60')}`}>
                <div className={cx('banner-2')}>
                    <Link className="wrapper">
                        <img src="https://i.imgur.com/SnYul8k.png" alt="" />
                    </Link>
                    <Link className="wrapper">
                        <img src="https://i.imgur.com/yLuBIAt.png" alt="" />
                    </Link>
                </div>
                <div className={`mb-30 ${cx('trademark')}`}>
                    <div
                        className={cx('trademark-track')}
                        style={{
                            transform: `translate3d(-1110px, 0px, 0px)`,
                            transition: '0.25s',
                        }}
                    >
                        {Object.values(listTrademark).map((value, index) => {
                            if (!!value && typeof value === 'string') {
                                return (
                                    <div key={index} className={cx('trademark-img')}>
                                        <Link>
                                            <img src={value} alt="" />
                                        </Link>
                                    </div>
                                );
                            }
                            return null;
                        })}
                    </div>
                </div>
                <div className={`wrapper mb-70 ${cx('banner-3')}`}>
                    <div className={cx('banner-3_')}>
                        <img className={cx('imgBackground')} src="https://i.imgur.com/XqKY9rt.png" alt="" />
                        <div className={cx('banner-img')}>
                            <img src="https://i.imgur.com/zoIKFrs.png" alt="" />
                        </div>
                        <div className={cx('content')}>
                            <div className={cx('content_')}>
                                <div>
                                    <span className={cx('title')}>Pha lê, kim cương</span>
                                    <span className={cx('type')}>Bộ sưu tập đồng hồ nữ</span>
                                    <span className={cx('description')}>
                                        Sang trọng cùng bộ sưu tập đồng hồ đính pha lê, kim cương dành cho phái đẹp
                                    </span>
                                    <div>
                                        <Link>Vào cửa hàng</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={cx('navigation')}>
                        <span className={cx('prev')}>‹</span>
                        <span className={cx('next')}>›</span>
                    </div>
                </div>
                <div className={cx('product')}>
                    <div className={`mb-70 ${cx('list-product')}`}>
                        <span>Bán chạy nhất</span>
                        <div className={cx('navigation')}>
                            <div className={activeTypeProductQua === 'dong-ho-nam' ? 'active-product' : ''}>
                                <Link
                                    onClick={() => {
                                        getTypeProductQua('quaNam', 'dong-ho-nam');
                                    }}
                                >
                                    Đồng hồ nam
                                </Link>
                            </div>
                            <div className={activeTypeProductQua === 'dong-ho-nu' ? 'active-product' : ''}>
                                <Link
                                    onClick={() => {
                                        getTypeProductQua('quaNu', 'dong-ho-nu');
                                    }}
                                >
                                    Đồng hồ nữ
                                </Link>
                            </div>
                            <div className={activeTypeProductQua === 'dong-ho-doi' ? 'active-product' : ''}>
                                <Link
                                    onClick={() => {
                                        getTypeProductQua('quaDoi', 'dong-ho-doi');
                                    }}
                                >
                                    Đồng hồ đôi
                                </Link>
                            </div>
                        </div>
                        <div className={cx('product')}>
                            <Products products={productsQua} linkTo={activeTypeProductQua} />
                        </div>
                        <div className={cx('more')}>
                            <div className="line-full"></div>
                            <Link>Xem thêm đồng hồ nam bán chạy</Link>
                        </div>
                    </div>
                    <div className={`mb-70 ${cx('list-product')}`}>
                        <span>Sản phẩm mới</span>
                        <div className={cx('navigation')}>
                            <div className={activeTypeProductNew === 'dong-ho-nam' ? 'active-product' : ''}>
                                <Link
                                    onClick={() => {
                                        getTypeProductNew('newNam', 'dong-ho-nam');
                                    }}
                                >
                                    Đồng hồ nam
                                </Link>
                            </div>
                            <div className={activeTypeProductNew === 'dong-ho-nu' ? 'active-product' : ''}>
                                <Link
                                    onClick={() => {
                                        getTypeProductNew('newNu', 'dong-ho-nu');
                                    }}
                                >
                                    Đồng hồ nữ
                                </Link>
                            </div>
                            <div className={activeTypeProductNew === 'dong-ho-doi' ? 'active-product' : ''}>
                                <Link
                                    onClick={() => {
                                        getTypeProductNew('newDoi', 'dong-ho-doi');
                                    }}
                                >
                                    Đồng hồ đôi
                                </Link>
                            </div>
                        </div>
                        <div className={cx('product')}>
                            <Products products={productsNew} linkTo={activeTypeProductNew} />
                        </div>
                        <div className={cx('more')}>
                            <div className="line-full"></div>
                            <Link>Xem thêm đồng hồ nam mới</Link>
                        </div>
                    </div>
                </div>
                <div className={`mb-70 ${cx('trademarks')}`}>
                    <div className={cx('title')}>
                        <div>Thương hiệu nổi bật</div>
                        <Link>Xem tất cả {'>>'} </Link>
                    </div>
                    <div className={cx('trademark')}>
                        <span className={cx('prev')}>‹</span>
                        <Link className={cx('item')}>
                            <img
                                className={cx('img')}
                                src="https://donghoduyanh.com/images/products/menufactories/resized/hamilton_1612251962.jpg.webp"
                                alt=""
                            />
                            <div>
                                <img
                                    src="https://donghoduyanh.com/images/products/menufactories/resized/logo_1717577425.png.webp"
                                    alt=""
                                />
                            </div>
                        </Link>
                        <Link className={cx('item')}>
                            <img
                                className={cx('img')}
                                src="https://donghoduyanh.com/images/products/menufactories/resized/hamilton_1612251962.jpg.webp"
                                alt=""
                            />
                            <div>
                                <img
                                    src="https://donghoduyanh.com/images/products/menufactories/resized/logo_1717577425.png.webp"
                                    alt=""
                                />
                            </div>
                        </Link>
                        <Link className={cx('item')}>
                            <img
                                className={cx('img')}
                                src="https://donghoduyanh.com/images/products/menufactories/resized/hamilton_1612251962.jpg.webp"
                                alt=""
                            />
                            <div>
                                <img
                                    src="https://donghoduyanh.com/images/products/menufactories/resized/logo_1717577425.png.webp"
                                    alt=""
                                />
                            </div>
                        </Link>
                        <Link className={cx('item')}>
                            <img
                                className={cx('img')}
                                src="https://donghoduyanh.com/images/products/menufactories/resized/hamilton_1612251962.jpg.webp"
                                alt=""
                            />
                            <div>
                                <img
                                    src="https://donghoduyanh.com/images/products/menufactories/resized/logo_1717577425.png.webp"
                                    alt=""
                                />
                            </div>
                        </Link>
                        <span className={cx('next')}>›</span>
                    </div>
                </div>
                <div className={cx('myShop')}>
                    <div className={`mb-30 ${cx('title')}`}>
                        <span>Vì sao nên chọn chúng tôi</span>
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
                    <div className={cx('certificate')}>
                        <div className={cx('body-left')}>
                            <div className={cx('agent')}>
                                <span>Đaị lý ủy quyền chính thức các thương hiệu lớn</span>
                                <Link>Xem tất cả</Link>
                            </div>
                            <div className={cx('certify')}>
                                <span>
                                    Chứng nhận Duy Anh Watch là Đại lý ủy quyền chính thức thương hiệu LONGINES tại Việt
                                    Nam (<Link>Xem ngay</Link>)
                                </span>
                            </div>
                            <div className={cx('trademark')}>
                                <div className={cx('prev')}>‹</div>
                                <div>
                                    <img className={cx('active')} src="https://i.imgur.com/fZqCInX.jpg" alt="" />
                                    <img src="https://i.imgur.com/fZqCInX.jpg" alt="" />
                                    <img src="https://i.imgur.com/fZqCInX.jpg" alt="" />
                                </div>
                                <div className={cx('next')}>›</div>
                            </div>
                        </div>

                        <div className={cx('body-right')}>
                            <img src={imgWhyMe} alt="" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
