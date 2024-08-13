import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
gsap.registerPlugin(ScrollTrigger);
import { useEffect, useRef, useState } from "react";

import { hightlightsSlides } from "@/lib/constants";
import { pauseImg, playImg, replayImg } from "@/utils";
import Image from "next/image";

const VideoCarousel = () => {
  const videoRef = useRef([]);
  const videoSpanRef = useRef([]);
  const videoDivRef = useRef([]);

  // video and indicator
  const [video, setVideo] = useState({
    isEnd: false,
    startPlay: false,
    videoId: 0,
    isLastVideo: false,
    isPlaying: false,
  });

  const [loadedData, setLoadedData] = useState([]);
  const { isEnd, isLastVideo, startPlay, videoId, isPlaying } = video;

  useGSAP(() => {
    gsap.to("#slider", {
      transform: `translateX(${-100 * videoId}%)`,
      duration: 2,
      ease: "power2.inOut",
    });

    gsap.to("#video", {
      scrollTrigger: {
        trigger: "#video",
        toggleActions: "restart none none none",
      },
      onComplete: () => {
        setVideo((pre) => ({
          ...pre,
          startPlay: true,
          isPlaying: true,
        }));
      },
    });
  }, [isEnd, videoId]);

  useEffect(() => {
    let currentProgress = 0;
    let span = videoSpanRef.current;

    if (span[videoId]) {
      let anim = gsap.to(span[videoId], {
        onUpdate: () => {
          const progress = Math.ceil(anim.progress() * 100);

          if (progress != currentProgress) {
            currentProgress = progress;

            gsap.to(videoDivRef.current[videoId], {
              width:
                window.innerWidth < 760
                  ? "10vw"
                  : window.innerWidth < 1200
                  ? "10vw"
                  : "4vw",
            });

            gsap.to(span[videoId], {
              width: `${currentProgress}%`,
              backgroundColor: "white",
            });
          }
        },

        onComplete: () => {
          if (isPlaying) {
            gsap.to(videoDivRef.current[videoId], {
              width: "12px",
            });
            gsap.to(span[videoId], {
              backgroundColor: "#afafaf",
            });
          }
        },
      });

      if (videoId == 0) {
        anim.restart();
      }

      const animUpdate = (x: number = 0) => {
        const prog = x;
        anim.progress(
          prog > 0
            ? // @ts-ignore
              videoRef.current[videoId].currentTime /
                hightlightsSlides[videoId].videoDuration
            : prog
        );
      };

      if (isPlaying) {
        gsap.ticker.add(animUpdate);
      } else {
        gsap.ticker.remove(animUpdate);
      }
    }
  }, [videoId, startPlay, isPlaying]);

  useEffect(() => {
    if (loadedData.length > 3) {
      if (!isPlaying) {
        // @ts-ignore
        videoRef.current[videoId].pause();
      } else {
        // @ts-ignore
        startPlay && videoRef.current[videoId].play();
      }
    }
  }, [startPlay, videoId, isPlaying, loadedData]);

  const handleProcess = (type: any, i: any) => {
    switch (type) {
      case "video-end":
        setVideo((pre) => ({ ...pre, isEnd: true, videoId: i + 1 }));
        break;

      case "video-last":
        setVideo((pre) => ({ ...pre, videoId: 0, isLastVideo: false }));

        break;

      case "video-reset":
        setVideo((pre) => ({ ...pre, videoId: 0, isLastVideo: false }));
        break;

      case "pause":
        setVideo((pre) => ({ ...pre, isPlaying: !pre.isPlaying }));
        videoRef.current.forEach((video, index) => {
          if (video && index === videoId) {
            // @ts-ignore
            video.pause();
          }
        });
        break;

      case "play":
        setVideo((pre) => ({ ...pre, isPlaying: !pre.isPlaying }));
        videoRef.current.forEach((video, index) => {
          if (video) {
            if (index === videoId) {
              // @ts-ignore
              video.play();
            } else {
              // @ts-ignore
              video.pause();
            }
          }
        });
        break;

      case "click":
        if (videoId === i) {
          // Toggle play/pause for the same video

          setVideo((pre) => ({
            ...pre,
            isPlaying: !pre.isPlaying,
          }));
          if (videoRef.current[i]) {
            if (isPlaying) {
              // @ts-ignore
              videoRef.current[i].pause();
            } else {
              // @ts-ignore
              videoRef.current[i].play();
            }
          }
        } else {
          // Pause the currently playing video
          handleProcess("pause", i);
          // Play the clicked video
          setVideo((pre) => ({
            ...pre,
            videoId: i ?? 0,
            isPlaying: true,
          }));
          if (videoRef.current[i]) {
            // @ts-ignore
            videoRef.current[i].play();
          }
        }

      default:
        return video;
    }
  };
  // @ts-ignore
  const handleLoadedMetaData = (i, e) =>
    // @ts-ignore
    setLoadedData((pre: any) => [...pre, e]);

  return (
    <>
      <div className='flex items-center'>
        {hightlightsSlides.map((list, i) => (
          <div key={list.id} id='slider' className='sm:pr-20 pr-10'>
            <div className='video-carousel_container'>
              <div className='w-full h-full flex-center rounded-3xl overflow-hidden bg-black'>
                <video
                  id='video'
                  playsInline={true}
                  className={`${
                    list.id === 2 && "translate-x-44"
                  } pointer-events-none`}
                  preload='auto'
                  muted
                  // @ts-ignore
                  ref={(el) => (videoRef.current[i] = el)}
                  onEnded={() =>
                    i !== 3
                      ? // @ts-ignore
                        handleProcess("video-end", i)
                      : // @ts-ignore
                        handleProcess("video-last")
                  }
                  onPlay={() =>
                    setVideo((pre) => ({ ...pre, isPlaying: true }))
                  }
                  onLoadedMetadata={(e) => handleLoadedMetaData(i, e)}
                >
                  <source src={list.video} type='video/mp4' />
                </video>
              </div>

              <div className='absolute top-12 left-[5%] z-10'>
                {list.textLists.map((text, i) => (
                  <p key={i} className='md:text-2xl text-xl font-medium'>
                    {text}
                  </p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className='relative flex-center mt-10'>
        <div className='flex-center py-5 px-7 bg-gray-300 backdrop-blur rounded-full'>
          {videoRef.current.map((_, i) => (
            <span
              key={i}
              className='mx-2 w-3 h-3 bg-gray-200 rounded-full relative cursor-pointer'
              // @ts-ignore

              ref={(el) => (videoDivRef.current[i] = el)}
            >
              <span
                className='absolute h-full w-full rounded-full'
                // @ts-ignore

                ref={(el) => (videoSpanRef.current[i] = el)}
                // @ts-ignore
                onClick={(el) => handleProcess("click", i)}
              />
            </span>
          ))}
        </div>

        <button className='control-btn'>
          <Image
            src={isLastVideo ? replayImg : !isPlaying ? playImg : pauseImg}
            alt={isLastVideo ? "replay" : !isPlaying ? "play" : "pause"}
            width={20}
            height={20}
            onClick={
              isLastVideo
                ? // @ts-ignore
                  () => handleProcess("video-reset")
                : !isPlaying
                ? // @ts-ignore

                  () => handleProcess("play")
                : // @ts-ignore

                  () => handleProcess("pause")
            }
          />
        </button>
      </div>
    </>
  );
};

export default VideoCarousel;
