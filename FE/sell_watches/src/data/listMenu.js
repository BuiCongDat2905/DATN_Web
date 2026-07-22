export const listWatch = {
    image: false,
    'thương hiệu': [
        'longines',
        'tissot',
        'mido',
        'hamilton',
        'certina',
        'maurice lacroix',
        'frederique constant',
        'calvin klein',
        'edox',
        'titoni',
        'claude bernard',
        'seiko',
        'citizen',
        'orient',
        'casio',
        'olym pianus',
        'daniel wellington',
        'fossil',
        'skagen',
        'michael kors',
    ],
    'mức giá': [
        'dưới 2 triệu',
        'từ 2 triệu đến 5 triệu',
        'từ 5 triệu đến 10 triệu',
        'từ 10 triệu đến 20 triệu',
        'từ 20 triệu đến 30 triệu',
        'từ 30 triệu đến 50 triệu',
        'từ 50 triệu đến 100 triệu',
        ' trên 100 triệu',
    ],
    'loại máy': [
        'automatic (máy cơ học tự động)',
        'quartz (máy pin-điện tử)',
        'eco-drive (năng lượng ánh sáng)',
        'quartz chronograph (máy pin bấm giờ thể thao)',
        'automatic chronometer (máy cơ tự động chuẩn cosc',
        'quartz chronometer (máy pin chuẩn cosc',
        'automatic chronograph (máy cơ tự động bấm giờ thể thao)',
        'năng lượng ánh sáng',
        'đồng hồ cơ lên dây cót bằng tay (manual winding)',
    ],
    'chất liệu dây': [
        'dây da',
        'dây kim loại',
        'Thép không gỉ 316L mạ vàng công nghệ PVD',
        'Thép không gỉ 316L dạng lưới',
        'Thép không gỉ 316L dạng lắc',
        'Thép không gỉ 316L Vàng 18K',
        'Thép không gỉ 316L Ceramic',
        'Thép không gỉ mạ công nghệ PVD',
        'Dây cao su',
        'Dây vải dù',
        'Titanium',
        'Titanium mạ vàng công nghệ PVD',
        'Nhựa',
    ],
    'phong cách': ['Sang trọng', 'Thể thao', 'Thể thao sang trọng', 'Quân đội', 'Thời trang', 'Hiện đại'],
};
export const listClock = {
    image: false,
    'thương hiệu': ['SEIKO', 'RHYTHM'],
    'mức giá': ['Dưới 2 triệu', 'Từ 2 triệu đến 5 triệu', 'Trên 5 triệu'],
    'vỏ máy': ['Thủy Tinh', 'Nhựa', 'Gỗ'],
};
export const listOther = {
    image: false,
    Khác: [
        'Đồng hồ Thụy Sỹ',
        'Đồng Hồ Nhật Bản',
        'Trang sức DW',
        'Dây đeo đồng hồ',
        'Đồng hồ để bàn',
        'Đồng hồ báo thức',
        'Trang sức CALVIN KLEIN',
    ],
};
export const listStrap = {};

export const listFilter = [
    {
        title: 'Giới tính',
        data: ['Nam', 'Nữ', 'Đôi'],
    },
    {
        title: 'Thương hiệu',
        data: listWatch['thương hiệu'],
    },
    {
        title: 'Mức giá',
        data: listWatch['mức giá'],
    },
    {
        title: 'Khuyến mãi',
    },
    {
        title: 'Loại máy',
        data: listWatch['loại máy'],
    },
    {
        title: 'Đường kính',
    },
    {
        title: 'Chất liệu dây',
        data: listWatch['chất liệu dây'],
    },
    {
        title: 'Chất liệu vỏ',
    },
    {
        title: 'Mặt kính',
    },
    {
        title: 'Màu mặt',
    },
    {
        title: 'Phong cách',
        data: listWatch['phong cách'],
    },
    {
        title: 'Kiểu dáng',
    },
    {
        title: 'Xuất xứ',
    },
];
