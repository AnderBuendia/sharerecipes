// @ts-nocheck
import { User } from '@Models/User';
import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import uploadImage from '@Middleware/uploadImage';
import { verifyToken } from '@Utils/auth.utils';

const uploadRouter = Router();

uploadRouter.post('/user', uploadImage, async (req: Request, res: Response) => {
  if (req.file) {
    const { filename } = req.file;
    const image_url = `${process.env.BACKEND_URL}/images/${filename}`;
    const authorization = req.headers['authorization'];

    if (authorization) {
      try {
        const token = authorization.split(' ')[1];
        const userId = verifyToken({
          token,
          code: process.env.SECRET_JWT_ACCESS,
        });

        let user = await User.findById(userId);

        if (user.image_name) {
          const pathName = path.join(
            process.cwd(),
            `/images/${user.image_name}`
          );
          fs.unlinkSync(pathName);
        }

        user = await User.findOneAndUpdate(
          { _id: user._id },
          {
            image_url,
            image_name: filename,
          },
          { new: true }
        );

        return res.json({ image_url, filename });
      } catch (error) {
        console.log(error);
      }
    }
  }

  res.send('Image upload file');
});

uploadRouter.post(
  '/recipes',
  uploadImage,
  async (req: Request, res: Response) => {
    if (req.file) {
      const { filename } = req.file;
      const image_url = `${process.env.BACKEND_URL}/images/${filename}`;
      const authorization = req.headers['authorization'];

      if (authorization) {
        try {
          return res.json({ image_url, filename });
        } catch (error) {
          console.log(error);
        }
      }
    }

    res.send('Image upload file');
  }
);

export default uploadRouter;
