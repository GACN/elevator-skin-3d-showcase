# ZOMER Elevator Skin · 3D Showcase / 中梦电梯皮肤 · 3D 展厅

A 1:1 real-scale elevator cabin showcase in **one HTML file, zero dependencies**.
Walls, door leaves and jambs are cut from real shop drawings to real millimetres —
switch skins, change viewpoint, or click any surface to load your own texture.

**Live demo:** https://gacn.github.io/elevator-skin-3d-showcase/

---

## English

### Model

- Cabin: three walls 150 / 160 / 150 cm wide × 245 cm high
- Landing doors: 90 × 210 cm, centre-split (each leaf is the matching half of the drawing; inner and outer faces use different artwork)
- Door-side narrow walls: 35 × 245 cm (button panel overlaid)
- Transom above the doors (pre-mirrored horizontally)
- 4 skin sets × 8 surfaces each

### Views

- **Interior perspective** — textures applied to the door frames
- **Landing / hall** — plain grey frame (#E0E0E0), no button panel
- **Interior ↔ exterior comparison** — both door layers at once

Floor and ceiling are hidden to avoid texture misalignment.

### Interaction

- Drag / mouse wheel / double-click to orbit; auto-rotate turns itself off while you drag
- Click any face to upload your own image (9 regions, persisted in `localStorage`)
- Case carousel + save / load / delete named schemes (stored in `localStorage`)
- Material Design 3 (vibrant orange), mobile-first layout

### Run locally

```bash
python3 -m http.server 8812
# open http://127.0.0.1:8812/  (LAN: http://<your-ip>:8812/)
```

Textures were processed from 396 MB of source images down to 514 KB of WebP
(`assets/{1,2,3,4}/`).

### License

MIT — see [LICENSE](LICENSE). Note the texture artwork originates from ZOMER
Group elevator skin designs.

---

## 中文

1:1 实尺电梯皮肤展示：150+160+150×245cm 轿厢三面 / 90×210cm 中分对开门 /
35×245cm 门侧窄墙，4 组 × 8 张皮肤。

- 左/中/右 = 后/侧墙 150/160/150cm
- 内部左边/右边 = 门侧 35cm 窄墙（灰色水滴含按钮面板叠加）
- 内门/外门 = 各自中分裁开，左扇取左半、右扇取右半，开关拼回整张（内/外门图不同）
- 内上/内部门上 = 门头横封（已水平镜像）
- 视图：内部透视（纹理门套） / 外部候梯（纯灰门套 #E0E0E0、无按钮） / 内外对照（双层门）
- 底面顶面隐藏以避免错位，拖拽/滚轮/双击 + 自动旋转
- 点击任意面可上传自己的贴图（9 区域，`localStorage` 持久化）
- 案例轮播 + 命名方案保存/载入/删除

本地预览：`python3 -m http.server 8812` 打开 `http://127.0.0.1:8812/`，
局域网 `http://<ip>:8812/`

原图 396MB → WebP 514KB，资源在 `assets/{1,2,3,4}/`。

协议：MIT（见 [LICENSE](LICENSE)）。贴图素材来自中梦集团电梯皮肤设计。
