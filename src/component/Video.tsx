'use client';

import { useState, useEffect } from "react";
import { Card, Modal, Row, Col, Input, Button, Form } from "antd";
import { UploadOutlined, SearchOutlined } from "@ant-design/icons";
import Image from "next/image";
import { supabase } from "../../lib/supabase/client";
import { VideoAlbion } from "@/store/video";
import { useRouter, useSearchParams } from 'next/navigation';
import useTrans from "@/hooks/useTrans";
import { getYouTubeVideoId, getYouTubeThumbnail } from "@/utils/youtube";
import { GridSkeleton } from "@/component/Skeleton";

const { Meta } = Card;

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
    <div className="p-4 md:p-6 w-full h-full rounded-[32px] border-2 border-[var(--border-color)] bg-[var(--bg-panel-solid)] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-[var(--text-primary)] theme-transition $1">
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
              className={`py-3 px-6 rounded-full border-2 border-[var(--border-color)] font-extrabold sora-font text-sm tracking-tight cursor-pointer transition-all duration-200 ${
                isActive 
                  ? 'bg-[var(--color-accent)] text-[var(--text-btn-upload)] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] -translate-y-[1px]' 
                  : 'bg-[var(--bg-panel-solid)] hover:bg-[var(--bg-column)] text-[var(--text-primary)] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-[1px]'
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
          prefix={<SearchOutlined className="text-[var(--text-primary)] text-lg mr-2" />}
          placeholder={trans.common.searchPlaceholder}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          style={{
            backgroundColor: 'var(--bg-input)',
            color: 'var(--text-input)',
            borderColor: 'var(--border-color)',
          }}
          className="!shadow-none !h-11 px-4 !rounded-full border-2 border-[var(--border-color)] focus:border-[var(--border-color)] hover:border-[var(--border-color)] max-w-md focus:ring-0 theme-transition $1"
        />
      </div>
      
      {/* Videos List Grid */}
      {loading ? (
        <GridSkeleton count={8} />
      ) : (
        <Row gutter={[16, 16]}>
          {filteredVideos.map((video) => (
            <Col key={video.id} xs={24} sm={12} md={8} lg={6}>
              <Card
                hoverable
                className="w-full rounded-2xl border-2 border-[var(--border-color)] overflow-hidden bg-[var(--bg-panel-solid)] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-[2px] transition-all duration-200"
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
                <Meta title={<span className="text-[var(--text-primary)] font-extrabold sora-font text-[14px] tracking-tight">{video.name}</span>} />
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Upload Button */}
      <div className="flex gap-2 mt-6 justify-between items-center border-t-2 border-[var(--border-color)] pt-4">
        <p></p>
        <Button
          type="primary"
          icon={<UploadOutlined />}
          className="!h-11 !px-6 !rounded-full border-2 border-[var(--border-color)] !bg-[var(--color-accent)] hover:!bg-[var(--color-accent-hover)] !text-[var(--text-btn-upload)] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-[1px] active:translate-y-[1px] !font-bold sora-font transition-all duration-200"
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
            <Input className="border-2 border-[var(--border-color)] rounded-xl h-10" />
          </Form.Item>
          <Form.Item
            name="url" 
            label={<span className="font-bold text-sm">{trans.video.urlLabel}</span>}
            rules={[{ required: true, message: trans.video.messageUrl }, { type: 'url', message: trans.video.messageUrlInvalid }]}
          >
            <Input className="border-2 border-[var(--border-color)] rounded-xl h-10" />
          </Form.Item>
          <Form.Item
            name="description" 
            label={<span className="font-bold text-sm">{trans.video.descLabel}</span>}
            rules={[{ required: true, message: trans.video.messageDesc }]}
          >
            <Input.TextArea className="border-2 border-[var(--border-color)] rounded-xl" rows={4} />
          </Form.Item>
          <Form.Item className="flex justify-end mb-0">
            <Button 
              type="primary" 
              htmlType="submit"
              className="!h-10 !px-5 !rounded-full border-2 border-[var(--border-color)] !bg-[var(--color-accent)] hover:!bg-[var(--color-accent-hover)] !text-[var(--text-btn-upload)] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-[1px] !font-bold sora-font transition-all"
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
