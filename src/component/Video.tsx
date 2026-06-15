'use client';

import React, { useState, useEffect } from "react";
import { Card, Modal, Row, Col, Spin, Input, Button, Form } from "antd";
import { UploadOutlined, SearchOutlined } from "@ant-design/icons";
import Image from "next/image";
import { supabase } from "../../lib/supabase/client";
import { VideoAlbion } from "@/store/video";
import { useRouter, useSearchParams } from 'next/navigation';
import useTrans from "@/hooks/useTrans";

const { Meta } = Card;

const getYouTubeVideoId = (url: string | null) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

const getYouTubeThumbnail = (videoId: string | null) => {
  return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : "/placeholder.jpg";
};

type SupabaseVideo = {
  id: string;
  name: string | null;
  url: string | null;
  description: string | null;
  category: string | null;
};

type VideoWithThumbnailType = {
  id: string;
  name: string;
  url: string;
  description: string;
  category: string;
  thumbnail: string;
};

const VideoPage = () => {
  const { trans } = useTrans();
  const tabs = [
    { key: "Highlight", label: trans.video.categoryHighlight },
    { key: "Funny Moment", label: trans.video.categoryFunny },
    { key: "Record", label: trans.video.categoryRecord }
  ];

  const [isUploadModalVisible, setIsUploadModalVisible] = useState(false);
  const [videosWithThumbnails, setVideosWithThumbnails] = useState<VideoWithThumbnailType[]>([]);
  const [activeTab, setActiveTab] = useState("Highlight");
  const [searchValue, setSearchValue] = useState("");
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams(); 

  useEffect(() => {
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl && tabs.some(t => t.key === tabFromUrl)) {
      setActiveTab(tabFromUrl);
    } else {
      setActiveTab("Highlight");
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .eq('category', activeTab);

      if (error || !data || data.length === 0) {
        const fallbackVideos = (VideoAlbion as any)[activeTab] || [];
        const dataWithThumbnails: VideoWithThumbnailType[] = fallbackVideos.map((video: any) => {
          const videoId = getYouTubeVideoId(video.url);
          const thumbnail = getYouTubeThumbnail(videoId);
          return {
            id: video.id.toString(),
            name: video.name,
            url: video.url || '',
            description: video.description,
            category: activeTab,
            thumbnail: thumbnail,
          };
        });
        setVideosWithThumbnails(dataWithThumbnails);
      } else {
        const dataWithThumbnails: VideoWithThumbnailType[] = data.map((video: SupabaseVideo) => {
          const videoId = getYouTubeVideoId(video.url);
          const thumbnail = getYouTubeThumbnail(videoId);
          return {
            id: video.id,
            name: video.name || trans.video.untitled,
            url: video.url || '',
            description: video.description || trans.video.noDescription,
            category: video.category || trans.video.general,
            thumbnail: thumbnail,
          };
        });
        setVideosWithThumbnails(dataWithThumbnails);
      }
      setLoading(false);
    };

    fetchVideos();
  }, [activeTab, trans]);

  const showUploadModal = () => setIsUploadModalVisible(true);
  const handleUploadCancel = () => {
    setIsUploadModalVisible(false);
    form.resetFields();
  };

  const handleUploadSubmit = async (values: { name: string; url: string; description: string }) => {
    const { data, error } = await supabase
      .from('videos')
      .insert({
        name: values.name,
        url: values.url,
        description: values.description,
        category: activeTab
      })
      .select();

    if (error) {
      return;
    }
    
    if (data && data.length > 0) {
      const newVideo = data[0] as SupabaseVideo;
      const videoId = getYouTubeVideoId(newVideo.url);
      const thumbnail = getYouTubeThumbnail(videoId);

      const newVideoWithThumbnail: VideoWithThumbnailType = {
        id: newVideo.id,
        name: newVideo.name || trans.video.untitled,
        url: newVideo.url || '',
        description: newVideo.description || trans.video.noDescription,
        category: newVideo.category || trans.video.general,
        thumbnail: thumbnail
      };

      setVideosWithThumbnails(prevVideos => [...prevVideos, newVideoWithThumbnail]);
    }

    handleUploadCancel();
  };

  const filteredVideos = videosWithThumbnails.filter((video) =>
    video.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div className="p-6 w-full h-full rounded-[32px] border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-black transition-all duration-300">
      {/* Category Tabs Selection */}
      <div className="flex flex-wrap justify-center gap-3 mb-6">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key);
                router.push(`/videos/?tab=${tab.key}`);
              }}
              className={`py-3 px-6 rounded-full border-2 border-black font-extrabold sora-font text-sm tracking-tight cursor-pointer transition-all duration-200 ${
                isActive 
                  ? 'bg-[#ebc7b5] text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] -translate-y-[1px]' 
                  : 'bg-white hover:bg-[#fcf8f2] text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-[1px]'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      
      {/* Search Input Bar */}
      <div className="flex justify-center mb-6">
        <Input
          prefix={<SearchOutlined className="text-black text-lg mr-2" />}
          placeholder={trans.common.searchPlaceholder}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          style={{
            backgroundColor: '#ffffff',
            color: '#000000',
            borderColor: '#000000',
          }}
          className="!shadow-none !h-11 px-4 !rounded-full border-2 border-black focus:border-black hover:border-black max-w-md focus:ring-0 transition-all duration-300"
        />
      </div>
      
      {/* Videos List Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spin size="large" />
        </div>
      ) : (
        <Row gutter={[16, 16]}>
          {filteredVideos.map((video) => (
            <Col key={video.id} xs={24} sm={12} md={8} lg={6}>
              <Card
                hoverable
                className="w-full rounded-2xl border-2 border-black overflow-hidden bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-[2px] transition-all duration-200"
                onClick={() => {
                  router.push(`/videos/${video.id}`);
                }}
                cover={
                  <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
                    <Image
                      alt={video.name}
                      src={video.thumbnail}
                      layout="fill"
                      objectFit="cover"
                      className="!rounded-t-xl"
                    />
                  </div>
                }
              >
                <Meta title={<span className="text-black font-extrabold sora-font text-[14px] tracking-tight">{video.name}</span>} />
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Upload Button */}
      <div className="flex gap-2 mt-6 justify-between items-center border-t-2 border-black pt-4">
        <p></p>
        <Button
          type="primary"
          icon={<UploadOutlined />}
          className="!h-11 !px-6 !rounded-full border-2 border-black !bg-[#ebc7b5] hover:!bg-[#ebbea7] !text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-[1px] active:translate-y-[1px] !font-bold sora-font transition-all duration-200"
          onClick={showUploadModal}
        >
          {trans.video.upload}
        </Button>
      </div>

      {/* Upload Modal */}
      <Modal
        title={<span className="sora-font font-extrabold text-xl">{trans.video.uploadTitle}</span>}
        open={isUploadModalVisible}
        onCancel={handleUploadCancel}
        footer={null}
        destroyOnClose={true}
        className="sircle-modal"
      >
        <Form form={form} onFinish={handleUploadSubmit} layout="vertical" className="mt-4">
          <Form.Item
            name="name" 
            label={<span className="font-bold text-sm">{trans.video.titleLabel}</span>}
            rules={[{ required: true, message: trans.video.messageTitle }]}
          >
            <Input className="border-2 border-black rounded-xl h-10" />
          </Form.Item>
          <Form.Item
            name="url" 
            label={<span className="font-bold text-sm">{trans.video.urlLabel}</span>}
            rules={[{ required: true, message: trans.video.messageUrl }, { type: 'url', message: trans.video.messageUrlInvalid }]}
          >
            <Input className="border-2 border-black rounded-xl h-10" />
          </Form.Item>
          <Form.Item
            name="description" 
            label={<span className="font-bold text-sm">{trans.video.descLabel}</span>}
            rules={[{ required: true, message: trans.video.messageDesc }]}
          >
            <Input.TextArea className="border-2 border-black rounded-xl" rows={4} />
          </Form.Item>
          <Form.Item className="flex justify-end mb-0">
            <Button 
              type="primary" 
              htmlType="submit"
              className="!h-10 !px-5 !rounded-full border-2 border-black !bg-[#ebc7b5] hover:!bg-[#ebbea7] !text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-[1px] !font-bold sora-font transition-all"
            >
              {trans.common.submit}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default VideoPage;
