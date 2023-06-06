import axios from 'axios';
import sha1 from 'crypto-js/sha1';
import {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_UPLOAD_PRESET,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
} from '@/app/config';

const cloudinaryUpload = async (image: any | Blob) => {
  if (!image) return '';
  if (typeof image === 'string') return image;
  try {
    const formData = new FormData();
    formData.append('file', image);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET as string);
    const response = await axios({
      url: `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      method: 'POST',
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return response.data.secure_url as string;
  } catch (error) {
    return false;
  }
};

const cloudinaryUploads = async (images: any[] | Blob[]) => {
  if (!images.length) return false;

  try {
    const urlImages = await Promise.all(
      images.map(async (image) => {
        if (typeof image === 'string') return image;
        const formData = new FormData();
        formData.append('file', image);
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET as string);
        const response = await axios({
          url: `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
          method: 'POST',
          data: formData,
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data.secure_url as string;
      })
    );
    return urlImages;
  } catch (error) {
    return false;
  }
};

const cloudinaryDelete = async (url: string) => {
  try {
    const parts = url.split('/');

    const publicId = parts[parts.length - 1].split('.')[0];
    const timestamp = new Date().getTime();

    const string = `public_id=${publicId}&timestamp=${1685225854919}&api_secret=${CLOUDINARY_API_SECRET}`;
    const signature = await sha1(string);

    const formData = new FormData();
    formData.append('api_key', CLOUDINARY_API_KEY as string);
    formData.append('public_id', publicId.trim());
    formData.append('timestamp', timestamp.toString());
    formData.append('signature', signature.toString());
    // formData.append('api_secret', CLOUDINARY_API_SECRET);

    await axios({
      url: `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/destroy`,
      method: 'POST',
      data: formData,
    });
    return true;
  } catch (error) {
    return false;
  }
};

export { cloudinaryUpload, cloudinaryUploads, cloudinaryDelete };
