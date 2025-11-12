import classNames from 'classnames/bind';
import style from './Menu.module.scss';
import { IconHome } from '~/components/icon';
import { Link } from 'react-router-dom';
import { listTrademark } from '~/assets';
import { useRef, useState } from 'react';
import TippyMenu from '~/components/PopperTippy/TippyMenu';
import { listClock, listOther, listStrap, listWatch } from '~/data';

const cx = classNames.bind(style);
function MainMenu() {
    const [isVisible, setIsVisible] = useState(false);
    const [contentMenu, setContentMenu] = useState();
    const [classHover, setClassHover] = useState(null);
    const tooltipRef = useRef(null);
    const triggerRef = useRef(null);

    const handleMouseEnter = (value, isValue, event) => {
        if (event) {
            const el = event.currentTarget || event.target;
            const elementA = el.querySelector('a');
            if (elementA) {
                if (classHover && !el.contains(classHover)) {
                    classHover.classList.remove(style.itemHover);
                }
                setClassHover(elementA);
                elementA.classList.add(style.itemHover);
            } else {
            }
        }
        if (isValue) {
            setContentMenu(value);
        }
        setIsVisible(true);
    };
    const handleMouseLeave = (e) => {
        var relatedTarget = e.relatedTarget;
        if (!relatedTarget || !(relatedTarget instanceof Node)) {
            setIsVisible(false);
            return;
        }

        if (!triggerRef.current?.contains(relatedTarget) && !tooltipRef.current?.contains(relatedTarget)) {
            if (classHover !== null && relatedTarget !== classHover) {
                classHover.classList.remove(style.itemHover);
            }
            setIsVisible(false);
        }
    };
    console.log();
    return (
        <div className={`${cx('menu')}`}>
            <div className="container">
                <ul className={cx('ul_menu')}>
                    <li className={cx('select')}>
                        <Link to={'/'}>
                            <IconHome />
                        </Link>
                    </li>
                    <li
                        ref={triggerRef}
                        onMouseEnter={(e) => handleMouseEnter(listTrademark, true, e)}
                        onMouseLeave={handleMouseLeave}
                    >
                        <Link to="/tran">Thương hiệu</Link>
                    </li>
                    <li
                        ref={triggerRef}
                        onMouseEnter={(e) => handleMouseEnter(listWatch, true, e)}
                        onMouseLeave={handleMouseLeave}
                    >
                        <Link>Đồng hồ nam</Link>
                    </li>
                    <li
                        ref={triggerRef}
                        onMouseEnter={(e) => handleMouseEnter(listWatch, true, e)}
                        onMouseLeave={handleMouseLeave}
                    >
                        <Link>Đồng hồ nữ</Link>
                    </li>
                    <li
                        ref={triggerRef}
                        onMouseEnter={(e) => handleMouseEnter(listWatch, true, e)}
                        onMouseLeave={handleMouseLeave}
                    >
                        <Link>Đồng hồ đôi</Link>
                    </li>
                    <li
                        ref={triggerRef}
                        onMouseEnter={(e) => handleMouseEnter(listClock, true, e)}
                        onMouseLeave={handleMouseLeave}
                    >
                        <Link>Đồng hồ treo tường</Link>
                    </li>
                    <li
                        ref={triggerRef}
                        onMouseEnter={(e) => handleMouseEnter(listStrap, true, e)}
                        onMouseLeave={handleMouseLeave}
                    >
                        <Link>Dây đồng hồ</Link>
                    </li>
                    <li
                        ref={triggerRef}
                        onMouseEnter={(e) => handleMouseEnter(listOther, true, e)}
                        onMouseLeave={handleMouseLeave}
                    >
                        <Link>Sản phẩm khác</Link>
                    </li>
                    <li
                        ref={triggerRef}
                        onMouseEnter={(e) => handleMouseEnter({}, true, e)}
                        onMouseLeave={handleMouseLeave}
                    >
                        <Link>Sửa đồng hồ</Link>
                    </li>
                    {isVisible ? (
                        <TippyMenu
                            content={contentMenu}
                            ref={tooltipRef}
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                        />
                    ) : null}
                </ul>
            </div>
        </div>
    );
}

export default MainMenu;
