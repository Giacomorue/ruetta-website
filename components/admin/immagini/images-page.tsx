"use client"

import React, { useState, useEffect } from 'react'

import { Image } from "prisma/prisma-client"
import { useAdminLoader } from '@/hooks/useAdminLoader';
import { disconnectPusher, getPusherClient } from '@/lib/pusherClient';
import HeaderBar from '../header-bar';
import UploadImageBtn from './upload-image-btn';
import ImagesList from './images-list';

function ImagesPage() {

  const [images, setImages] = useState<Image[]>([])
  const adminLoading = useAdminLoader();
  const [socketId, setSocketId] = useState('');

  const fetchData = async () => {
    adminLoading.startLoading();
    try {
      const response = await fetch(
        "/api/images"
      );
      const data = await response.json();

      console.log(data);

      setImages(data);
    } catch (error) {
      console.error("Errore durante il fetching dei dati", error);
    } finally {
      adminLoading.stopLoading();
    }
  };

  const fetchDataWithoutLoading = async () => {
    adminLoading.startLoading();
    try {
      const response = await fetch(
        "/api/images"
      );
      const data = await response.json();

      setImages(data);
    } catch (error) {
      console.error("Errore durante il fetching dei dati", error);
    } finally {
      adminLoading.stopLoading();
    }
  };

  useEffect(() => {
    fetchData();

    const pusher = getPusherClient();
    const channel = pusher.subscribe(`dashboard-channel`);

    pusher.connection.bind("connected", () => {
      const id = pusher.connection.socket_id;
      setSocketId(id);
    });

    channel.bind("page-refresh", async (data: any) => {
      fetchDataWithoutLoading();
    });

    return () => {
      channel.unbind("page-refresh");
      pusher.unsubscribe(`dashboard-channel`);
      disconnectPusher();
    };
  }, []);


  if(!images) return <div>Loading...</div>

  return (
    <>
      <HeaderBar title="Immagini">
        <UploadImageBtn socketId={socketId??""} onRevalidate={fetchDataWithoutLoading} />
      </HeaderBar>
      <ImagesList images={images} socketId={socketId??""} onRevalidate={fetchDataWithoutLoading} />
    </>
  )
}

export default ImagesPage