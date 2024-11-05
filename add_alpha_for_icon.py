import cv2
import os
import numpy as np

def add_alpha_channel(image_path, output_path):
    # 读取图像
    image = cv2.imread(image_path, cv2.IMREAD_UNCHANGED)
    
    # 检查图像是否已经有 alpha 通道
    if image.shape[2] == 4:
        return
    
    # 创建一个全白的 alpha 通道
    alpha_channel = 255 * np.ones((image.shape[0], image.shape[1]), dtype=image.dtype)
    
    # 将 alpha 通道添加到图像
    image_with_alpha = cv2.merge((image, alpha_channel))
    
    # 保存图像
    cv2.imwrite(output_path, image_with_alpha)

def process_images_in_folder(input_folder, output_folder):
    for root, _, files in os.walk(input_folder):
        # 计算输出目录的相对路径
        relative_path = os.path.relpath(root, input_folder)
        output_dir = os.path.join(output_folder, relative_path)
        
        if not os.path.exists(output_dir):
            os.makedirs(output_dir)
        
        for filename in files:
            if filename.endswith(('.png', '.jpg', '.jpeg')):
                input_path = os.path.join(root, filename)
                output_path = os.path.join(output_dir, filename)
                add_alpha_channel(input_path, output_path)
                print(f"Processed {input_path}")

# 使用示例
input_folder = './AppIcons'
output_folder = './NewAppIcons'
process_images_in_folder(input_folder, output_folder)
