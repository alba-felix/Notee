#!/usr/bin/env python3
from PyQt5.QtWidgets import (QDialog, QVBoxLayout, QHBoxLayout, QLabel, 
                             QPushButton, QScrollArea, QWidget, QMessageBox)
from PyQt5.QtCore import Qt
from PyQt5.QtGui import QPixmap
import sys
from pathlib import Path


class ImageViewer(QDialog):
    """图片查看器对话框"""
    
    def __init__(self, images, parent=None):
        super().__init__(parent)
        self.images = images
        self.current_index = 0
        
        self.setup_ui()
        self.setup_styles()
        self.show_image()
    
    def setup_ui(self):
        """设置UI布局"""
        self.setModal(True)
        self.setWindowTitle("图片查看器")
        self.resize(900, 720)
        # 允许窗口最大化
        self.setWindowFlags(self.windowFlags() | Qt.WindowMaximizeButtonHint)
        
        layout = QVBoxLayout(self)
        layout.setSpacing(10)
        layout.setContentsMargins(20, 20, 20, 20)
        
        # 图片显示区域
        self.scroll_area = QScrollArea()
        self.scroll_area.setWidgetResizable(True)
        
        self.image_container = QWidget()
        self.image_layout = QVBoxLayout(self.image_container)
        self.image_layout.setAlignment(Qt.AlignCenter)
        
        self.image_label = QLabel()
        self.image_label.setAlignment(Qt.AlignCenter)
        self.image_label.setObjectName("image_label")
        
        self.image_layout.addWidget(self.image_label)
        self.scroll_area.setWidget(self.image_container)
        layout.addWidget(self.scroll_area)
        
        # 控制按钮区域
        controls_layout = QHBoxLayout()
        
        self.prev_button = QPushButton("上一张")
        self.prev_button.clicked.connect(self.previous_image)
        
        self.next_button = QPushButton("下一张")
        self.next_button.clicked.connect(self.next_image)
        
        self.info_label = QLabel()
        self.info_label.setAlignment(Qt.AlignCenter)
        
        self.close_button = QPushButton("关闭")
        self.close_button.clicked.connect(self.accept)
        
        controls_layout.addWidget(self.prev_button)
        controls_layout.addWidget(self.info_label)
        controls_layout.addWidget(self.next_button)
        controls_layout.addStretch()
        controls_layout.addWidget(self.close_button)
        layout.addLayout(controls_layout)
    
    def setup_styles(self):
        """设置样式"""
        self.setStyleSheet("""
            QDialog {
                /* 背景色由主题控制 */
            }
            QPushButton {
                padding: 8px 16px;
                border: none;
                border-radius: 4px;
                font-size: 12px;
                /* 背景色和颜色由主题控制 */
            }
            QPushButton:hover {
                opacity: 0.9;
            }
            QPushButton:disabled {
                /* 背景色由主题控制 */
            }
            QLabel {
                font-size: 12px;
                /* 颜色由主题控制 */
            }
        """)
    
    def show_image(self):
        """显示当前图片"""
        if not self.images:
            self.image_label.setText("没有图片可显示")
            self.prev_button.setEnabled(False)
            self.next_button.setEnabled(False)
            self.info_label.setText("0/0")
            return
        
        if self.current_index < 0:
            self.current_index = 0
        if self.current_index >= len(self.images):
            self.current_index = len(self.images) - 1
        
        image_data = self.images[self.current_index]
        
        # 加载图片数据
        pixmap = QPixmap()
        filename = '未知文件'
        
        if isinstance(image_data, dict):
            if 'filepath' in image_data:
                if pixmap.load(image_data['filepath']):
                    filename = image_data.get('filename', '未知文件')
                else:
                    # 环境检测和路径设置
                    if getattr(sys, 'frozen', False):
                        # 打包后的环境
                        if hasattr(sys, '_MEIPASS'):
                            # PyInstaller创建的临时目录
                            internal_path = Path(sys._MEIPASS)
                            if internal_path not in sys.path:
                                sys.path.insert(0, str(internal_path))
                        
                        # 添加项目根目录到sys.path
                        app_dir = Path(sys.executable).parent
                        if app_dir not in sys.path:
                            sys.path.insert(0, str(app_dir))
                    
                    # 尝试多种导入方式
                    try:
                        # 尝试完整路径导入
                        from app.storage.note_storage import NoteStorage
                    except ImportError:
                        try:
                            # 尝试不带app前缀的导入
                            from storage.note_storage import NoteStorage
                        except ImportError:
                            try:
                                # 尝试相对导入
                                from ..storage.note_storage import NoteStorage
                            except ImportError:
                                # 最后尝试直接导入
                                import storage.note_storage as NoteStorage
                    
                    storage = NoteStorage()
                    image_path = storage.get_image_path(image_data.get('filename', ''))
                    if image_path.exists() and pixmap.load(str(image_path)):
                        filename = image_data.get('filename', '未知文件')
                    else:
                        self.image_label.clear()
                        self.image_label.setText("图片文件不存在或加载失败")
                        self.info_label.setText(f"{self.current_index + 1}/{len(self.images)} - {image_data.get('filename', '未知文件')}")
                        self.prev_button.setEnabled(self.current_index > 0)
                        self.next_button.setEnabled(self.current_index < len(self.images) - 1)
                        return
            elif 'data' in image_data:
                if not pixmap.loadFromData(image_data['data']):
                    self.image_label.clear()
                    self.image_label.setText("图片数据无效")
                    self.info_label.setText(f"{self.current_index + 1}/{len(self.images)} - {image_data.get('filename', '未知文件')}")
                    self.prev_button.setEnabled(self.current_index > 0)
                    self.next_button.setEnabled(self.current_index < len(self.images) - 1)
                    return
                filename = image_data.get('filename', '未知文件')
        else:
            # 如果是字符串路径，尝试从文件加载
            if isinstance(image_data, str):
                if not pixmap.load(image_data):
                    self.image_label.clear()
                    self.image_label.setText("图片加载失败")
                    self.info_label.setText(f"{self.current_index + 1}/{len(self.images)} - {image_data}")
                    self.prev_button.setEnabled(self.current_index > 0)
                    self.next_button.setEnabled(self.current_index < len(self.images) - 1)
                    return
                filename = image_data
        
        # 显示原画质图片（不缩放）
        self.image_label.setPixmap(pixmap)
        
        # 更新信息
        self.info_label.setText(f"{self.current_index + 1}/{len(self.images)} - {filename}")
        
        # 更新按钮状态
        self.prev_button.setEnabled(self.current_index > 0)
        self.next_button.setEnabled(self.current_index < len(self.images) - 1)
    
    def previous_image(self):
        """显示上一张图片"""
        if self.current_index > 0:
            self.current_index -= 1
            self.show_image()
    
    def next_image(self):
        """显示下一张图片"""
        if self.current_index < len(self.images) - 1:
            self.current_index += 1
            self.show_image()