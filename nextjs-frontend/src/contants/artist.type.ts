export const artist_type_group = {
  manufacturer: "NHÀ SẢN XUẤT",
  creative: "NGHỆ SĨ SÁNG TÁC",
  performing: "NGHỆ SĨ BIỂU DIỄN",
};

export const order = {
  [artist_type_group.performing]: 1, // Nghệ sĩ biểu diễn đứng đầu
  [artist_type_group.creative]: 2, // Nghệ sĩ sáng tác đứng thứ 2
  [artist_type_group.manufacturer]: 3, // Nhà sản xuất đứng cuối
};
