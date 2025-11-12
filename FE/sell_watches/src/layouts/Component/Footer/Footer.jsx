import classNames from 'classnames/bind';
import style from './Footer.module.scss';
import {
    IconEmail,
    IconFacebook,
    IconFacebook2,
    IconInstagram,
    IconPhone,
    IconShare,
    IconTime,
    IconTwitter,
    IconYoutobe,
    IconZalo,
} from '~/components/icon';
import { Link } from 'react-router-dom';

const cx = classNames.bind(style);
function Footer() {
    return (
        <div className={cx('footer')}>
            <div className={`${cx('top')}`}>
                <div className="container">
                    <div className={cx('item')}>
                        <IconTime />
                        <div className={cx('text')}>
                            <span className={cx('title')}>Mua hàng online</span>
                            <span>Tất cả các ngày trong tuần</span>
                        </div>
                    </div>
                    <div className={cx('line-left')}></div>
                    <div className={cx('item')}>
                        <IconPhone />
                        <div className={cx('item-container')}>
                            <div className={cx('text')}>
                                <span className={cx('title')}>Hỗ trợ bán hàng</span>
                                <span>036.786.0614</span>
                            </div>
                            <div className={cx('text')}>
                                <span className={cx('title')}>Hỗ trợ kỹ thuật</span>
                                <span>036.786.0614</span>
                            </div>
                        </div>
                    </div>
                    <div className={cx('line-left')}></div>
                    <div className={cx('item')}>
                        <IconEmail />
                        <div className={cx('text')}>
                            <span className={cx('title')}>Email</span>
                            <span>datcongh43@gmail.com</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className={cx('body')}>
                <div className={cx('top-body')}>
                    <div className={`container ${'content'}`}>
                        <div className={cx('item')}>
                            <span className={cx('title')}>Về donghoduyanh</span>
                            <Link>Giới thiệu về đồng hồ duy anh</Link>
                            <Link>Triết lý kinh doanh</Link>
                            <Link>Giấy chứng nhận và giải thưởng</Link>
                            <Link>Khách hàng nói gì về chúng tôi</Link>
                        </div>
                        <div className={cx('item')}>
                            <span className={cx('title')}>Chăm sóc khách hàng</span>
                            <Link>Hướng dẫn mua hàng</Link>
                            <Link>Chính sách đổi trả</Link>
                            <Link>Chính sách bảo hành</Link>
                            <Link>Dịch vụ sửa chữa</Link>
                            <Link>Hướng dẫn sử dụng đồng hồ</Link>
                            <Link>Chính sách khách hàng thân thiết</Link>
                        </div>
                        <div className={cx('item')}>
                            <span className={cx('title')}>Tiện ích</span>
                            <Link>Tin tức và sự kiện</Link>
                            <Link>Tuyển dụng</Link>
                            <Link>Thanh toán</Link>
                            <Link>Mua hàng online</Link>
                            <Link>Mua hàng trả góp</Link>
                        </div>
                        <div className={cx('contact')}>
                            <div className={cx('contact-face')}>
                                <div className={cx('img')}>
                                    <div>
                                        <img
                                            // src="https://scontent.fhan2-5.fna.fbcdn.net/v/t39.30808-1/340555166_912247146719894_7113894412172061816_n.jpg?stp=cp0_dst-jpg_s50x50_tt6&_nc_cat=106&ccb=1-7&_nc_sid=fe756c&_nc_eui2=AeFT_0joFmu-T4dc76QAqxnMHe1XmXZsGzgd7VeZdmwbOC_C7XrcUGdbeSNUY7i7Y-IgIaseDgo0AgMz4fM3ddMG&_nc_ohc=pR9dDpvMasAQ7kNvgGvUM5n&_nc_oc=Adh47m6FzXCBLCDK5Z7oYwPgZQDguHhL9fIG4ZOLSRN_cNiQNiCfMCg_YD9ZF0yUPkjh5KGf7ZHdGZ3W0mcv8DXD&_nc_zt=24&_nc_ht=scontent.fhan2-5.fna&_nc_gid=mhA7EHxcInKYS-dQv3xxVg&oh=00_AYFXuok9nA7CK6bMWow4L_RcJzcv70dSC_LqTN2qgawLTw&oe=67DDEF16"
                                            alt=""
                                        />
                                        <div>
                                            <span className={cx('name-shop')}>đồng hồ duy anh</span>
                                            <div className={cx('like')}>
                                                <span>100.100</span> người theo dõi
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <Link className={cx('follow')}>
                                    <IconFacebook />
                                    <span>Theo dõi Trang</span>
                                </Link>
                                <Link className={cx('share')}>
                                    <IconShare />
                                    <span>Chia sẻ</span>
                                </Link>
                            </div>
                            <div className={cx('linkTo')}>
                                <span className="title">Liên kết</span>
                                <Link className={cx('iconFacebook')}>
                                    <IconFacebook2 />
                                </Link>
                                <Link className={cx('iconTwitter')}>
                                    <IconTwitter />
                                </Link>
                                <Link className={cx('iconInstagram')}>
                                    <IconInstagram />
                                </Link>
                                <Link className={cx('iconYoutobe')}>
                                    <IconYoutobe />
                                </Link>
                                <Link className={cx('iconZalo')}>
                                    <IconZalo />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={cx('bottom-body')}>
                    <div className={cx('area')}>
                        <div>
                            <button>Hà nội</button>
                            <button className={cx('active-button')}>Hồ chí minh</button>
                        </div>
                    </div>
                    <div className={`container ${cx('branch')}`}>
                        <div className={cx('content')}>
                            <div className={cx('branch-1', 'line-bottom')}>
                                <div className={'title'}>Phố huế - hà nội</div>
                                <div className={cx('address')}>
                                    Địa chỉ: 200A Phố Huế, Quận Hai Bà Trưng, Hà Nội (gần ngã tư Phố Huế - Tô Hiến Thành
                                    - Nguyễn Công Trứ)
                                </div>
                                <div className={cx('phone')}>
                                    <span>Điện thoại:</span>
                                    <span>(036)786.0614</span>
                                </div>
                                <div className={cx('email')}>
                                    <span>Email:</span>
                                    <span>datcongh43@gmail.com</span>
                                </div>
                            </div>
                            <div className={cx('branch-2', 'line-bottom')}>
                                <div className={'title'}>Phố huế - hà nội</div>
                                <div className={cx('address')}>
                                    Địa chỉ: 200A Phố Huế, Quận Hai Bà Trưng, Hà Nội (gần ngã tư Phố Huế - Tô Hiến Thành
                                    - Nguyễn Công Trứ)
                                </div>
                                <div className={cx('phone')}>
                                    <span>Điện thoại:</span>
                                    <span>(036)786.0614</span>
                                </div>
                                <div className={cx('email')}>
                                    <span>Email:</span>
                                    <span>datcongh43@gmail.com</span>
                                </div>
                            </div>
                            <div className={cx('branch-3')}>
                                <div className={'title'}>Phố huế - hà nội</div>
                                <div className={cx('address')}>
                                    Địa chỉ: 200A Phố Huế, Quận Hai Bà Trưng, Hà Nội (gần ngã tư Phố Huế - Tô Hiến Thành
                                    - Nguyễn Công Trứ)
                                </div>
                                <div className={cx('phone')}>
                                    <span>Điện thoại:</span>
                                    <span>(036)786.0614</span>
                                </div>
                                <div className={cx('email')}>
                                    <span>Email:</span>
                                    <span>datcongh43@gmail.com</span>
                                </div>
                            </div>
                            <div className={cx('branch-4')}>
                                <div className={'title'}>Mua Hàng Online Hà Nội</div>
                                <div className={cx('address')}>Địa chỉ: Hà Nội</div>
                                <div className={cx('phone')}>
                                    <span>Điện thoại:</span>
                                    <span>(036)786.0614</span>
                                </div>
                                <div className={cx('email')}>
                                    <span>Email:</span>
                                    <span>datcongh43@gmail.com</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={` ${cx('bottom')}`}>
                <div className={`container ${cx('content')}`}>
                    <div>
                        <div className={`title ${cx('bottom-title')}`}>
                            CÔNG TY TNHH PHÁT TRIỂN VÀ THƯƠNG MẠI DUY ANH
                        </div>
                        <div>VPGD : 200A Phố Huế, Hai Bà Trưng, Hà Nội</div>
                        <div>Điện thoại : (024) 2.214.8336</div>
                        <div>MST: 0105545498 Cấp ngày: 03/10/2011 Nơi cấp: Hà Nội</div>
                    </div>

                    <div>
                        <div className={cx('img')}>
                            <img
                                // src='https://donghoduyanh.com/images/config/dathongbao.png'
                                alt=""
                            />
                            <div>© DuyAnhWatch-All rights reserved.</div>
                        </div>
                        <div>
                            <Link>Longines</Link>
                            <span className={cx('line-left')}>|</span>
                            <Link>Tissot</Link>
                            <span className={cx('line-left')}>|</span>
                            <Link> MIDO</Link>
                            <span className={cx('line-left')}>|</span>
                            <Link> Frederique Constant</Link>
                            <span className={cx('line-left')}>|</span>
                            <Link>Seiko</Link>
                            <span className={cx('line-left')}>|</span>
                            <Link>Citizen</Link>
                            <span className={cx('line-left')}>|</span>
                            <Link>Orient</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Footer;
