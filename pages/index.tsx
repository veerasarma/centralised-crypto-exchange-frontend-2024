import Image from "next/image";
import styles from "@/styles/common.module.css";
import { Container, Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import AOS from "aos";
import "aos/dist/aos.css";
import Mainnavbar from "../components/navbar";
import Footer from "../components/footer";
import dynamic from "next/dynamic";
import config from "../config"
//import component
const MarketTable = dynamic(() => import("@/components/Market/MarketTable"));
const BannerPage = dynamic(() => import("@/components/Market/bannerPage"));
const PairTable = dynamic(() => import("@/components/Market/PairTable"));
//import lib
import isEmpty from "@/lib/isEmpty";
//improt store
import { useSelector } from "../store";
import { useTheme } from "next-themes";
import { truncateDecimals } from "@/lib/roundOf";

export default function Home() {
  const { theme, setTheme } = useTheme();
  const { siteSetting } = useSelector((state: any) => state.UserSetting.data);
  const { session, user } = useSelector((state: any) => state.auth);

  const [isClient, setIsClient] = useState<boolean>(false);

  const router = useRouter();
  const settings = {
    dots: false,
    infinite: true, // Ensures it loops
    speed: 500, // Speed of the transition (in ms)
    slidesToShow: 4, // Number of items to show in the viewport
    slidesToScroll: 1, // How many items to scroll per swipe
    autoplay: true, // Enable auto-moving
    autoplaySpeed: 3000, // Time between scrolls (3 seconds)
    arrows: false, // Disable the next/prev arrows
  };


  useEffect(() => {
    AOS.init();
    setIsClient(true);
  }, []);
  return (
    <>
      <Mainnavbar />
      <section className={styles.header}>
        <Container>
          {/* <div className={styles.banner_float_icons}>
            <Image
              src="/assets/images/banner_icon_01.svg"
              alt="image"
              className="img-fluid"
              width={116}
              height={116}
            />
            <Image
              src="/assets/images/banner_icon_02.svg"
              alt="image"
              className="img-fluid"
              width={126}
              height={126}
            />
            <Image
              src="/assets/images/banner_icon_03.svg"
              alt="image"
              className="img-fluid"
              width={78}
              height={78}
            />
            <Image
              src="/assets/images/banner_icon_04.svg"
              alt="image"
              className="img-fluid"
              width={178}
              height={178}
            />
          </div> */}
          <Row>
            <Col
              md={10}
              xl={8}
              className="m-auto text-center"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              <h1>
                Find the next crypto gem on <span>B5 Exchange</span>
              </h1>
              <p className="py-3">
                Where Opportunities Meet Innovation! Discover seamless trading
                experiences, secure transactions, and a world of possibilities
                in the realm of cryptocurrencies.
              </p>

              {!session?.signedIn && (
                <button
                  className={`${styles.animate} ${styles.primary_btn}`}
                  onClick={() => router.push("/register")}
                >
                  <span></span>
                  <label>Signup Now</label>
                </button>
              )}
            </Col>
          </Row>
        </Container>
      </section>
      {
        isClient && !isEmpty(siteSetting) &&
        <section className={styles.ban_slider}  >
          <BannerPage />
          {/* <Container>
            <div className='slider' >
              <Slider {...settings}>
                <div>
                  <div className={styles.box} data-aos="flip-up" data-aos-duration="1000" >
                    <Image src={siteSetting?.bannerImg1} alt="image" className="img-fluid" width={300} height={150} />
                  </div>
                </div>
                <div>
                  <div className={styles.box} data-aos="flip-up" data-aos-duration="1000" data-aos-delay="300" >
                    <Image src={siteSetting?.bannerImg2} alt="image" className="img-fluid" width={300} height={150} />
                  </div>
                </div>
                <div>
                  <div className={styles.box} data-aos="flip-up" data-aos-duration="1000" data-aos-delay="600" >
                    <Image src={siteSetting?.bannerImg3} alt="image" className="img-fluid" width={300} height={150} />
                  </div>
                </div>
                <div>
                  <div className={styles.box} data-aos="fade-up" data-aos-duration="1000" data-aos-delay="900" >
                    <Image src={siteSetting?.bannerImg4} alt="image" className="img-fluid" width={300} height={150} />
                  </div>
                </div>
              </Slider>
            </div>
          </Container> */}
        </section>
      }
      <MarketTable />

      <section className={`${styles.crypto_exchange}`}>
        <Container>
          <div
            className={`${styles.head} text-start ms-0 w-100 pb-3`}
            data-aos="fade-up"
            data-aos-duration="1000"
          >
            <div className={styles.headFlexContent}>
              <div className={styles.leftTitle}>
                <h2 className={styles.h2tag}>
                  The most trusted cryptocurrency exchange
                </h2>
                <p>
                  We're the most trusted place for people and businesses to buy,
                  sell, and manage crypto.
                </p>
              </div>
              {!session?.signedIn && (
                <div className={styles.buttonRight}>
                  <button
                    className={`${styles.dark} ${styles.primary_btn} register butn`}
                  >
                    <span className={styles.button_chev}></span>
                    <a href="/register">
                      <label>Sign Up</label>
                    </a>
                  </button>
                </div>
              )}
            </div>
          </div>
          <Row>
            <Col
              lg={4}
              className="d-block d-lg-flex"
              data-aos="flip-up"
              data-aos-duration="1000"
            >
              <div className={`mb-3 mb-lg-0 ${styles.box}`}>
                <div className={styles.inbox}>
                  {theme === "light_theme" ? (
                    <Image
                      src="/assets/images/icon_01_light.svg"
                      alt="image"
                      className="img-fluid"
                      width={40}
                      height={40}
                    />
                  ) : (
                    <Image
                      src="/assets/images/icon_01.svg"
                      alt="image"
                      className="img-fluid"
                      width={40}
                      height={40}
                    />
                  )}
                  <h5 className={styles.h5tag}>The largest crypto company</h5>
                  <p>We operate with financial transparency.</p>
                </div>
              </div>
            </Col>
            <Col
              lg={4}
              className="d-block d-lg-flex"
              data-aos="flip-up"
              data-aos-duration="1000"
              data-aos-delay="300"
            >
              <div className={`mb-3 mb-lg-0 ${styles.box}`}>
                <div className={styles.inbox}>
                  {theme === "light_theme" ? (
                    <Image
                      src="/assets/images/icon_02_light.svg"
                      alt="image"
                      className="img-fluid"
                      width={40}
                      height={40}
                    />
                  ) : (
                    <Image
                      src="/assets/images/icon_02.svg"
                      alt="image"
                      className="img-fluid"
                      width={40}
                      height={40}
                    />
                  )}
                  <h5 className={styles.h5tag}>Your assets are protected</h5>
                  <p>
                    Our risk management measures are designed to protect your
                    assets.
                  </p>
                </div>
              </div>
            </Col>
            <Col
              lg={4}
              className="d-block d-lg-flex"
              data-aos="flip-up"
              data-aos-duration="1000"
              data-aos-delay="600"
            >
              <div className={`mb-3 mb-lg-0 ${styles.box}`}>
                <div className={styles.inbox}>
                  {theme === "light_theme" ? (
                    <Image
                      src="/assets/images/icon_03_light.svg"
                      alt="image"
                      className="img-fluid"
                      width={40}
                      height={40}
                    />
                  ) : (
                    <Image
                      src="/assets/images/icon_03.svg"
                      alt="image"
                      className="img-fluid"
                      width={40}
                      height={40}
                    />
                  )}
                  <h5 className={styles.h5tag}>Industry best practices</h5>
                  <p>
                    B5 Exchange supports a variety of the most popular digital
                    currencies.
                  </p>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <section className={`${styles.trending_pair}`}>
        {/* <PairTable /> */}
      </section>

      <section className={styles.discover_home}>
        <Container>
          <h2 className={styles.h2tag}>Discover our products</h2>

          <Row className={"mt-5"}>
            <Col lg={4} data-aos="flip-up" data-aos-duration="1000">
              <div className={styles.discover_card}>
                <div className={styles.titleTop}>
                  <h3>Spot</h3>
                  <span
                    onClick={() => router.push(`/spot`)}
                    className={styles.arrowBox}
                  ></span>
                </div>
                <p>
                  Over 750+ coins available. Buy and sell quickly with automatic
                  calculation of average cost and PnL.
                </p>
              </div>
              <div className={styles.discover_card}>
                <div className={styles.titleTop}>
                  <h3>Futures</h3>
                  <span
                    onClick={() => router.push(`/futures`)}
                    className={styles.arrowBox}
                  ></span>
                </div>
                <p>
                  Supports long/short positions with leverage and profit of up
                  to 125x from market volatilities.
                </p>
              </div>
              {config.MODE !== "prod" &&
                <div className={styles.discover_card}>
                  <div className={styles.titleTop}>
                    <h3>Inverse perpetual </h3>
                    <span
                      onClick={() => router.push(`/inverse/BTC_USDT`)}
                      className={styles.arrowBox}
                    ></span>
                  </div>
                  <p>
                    Create your personal trading strategy and profit 24/7 with
                    spot grid and futures inverse perpetual.
                  </p>
                </div>
              }
            </Col>
            <Col lg={8} data-aos="flip-up" data-aos-duration="1000">
              <div className={styles.discover_img}>
                <Image
                  src="/assets/images/b5_trade_dark.jpg"
                  alt="image"
                  className="img-fluid darkImg"
                  width={812}
                  height={489}
                />
                <Image
                  src="/assets/images/b5_trade_light.jpg"
                  alt="image"
                  className="img-fluid lightImg"
                  width={812}
                  height={489}
                />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <section className={`${styles.home_anytime_anywhere}`}>
        <Container>
          <div className={styles.head}>
            <h2 className="h2tag">Trade. Anytime. Anywhere.</h2>
            <p>
              Sign up for a B5 Exchange account today and see what the world of
              decentralized finance can do for you.
            </p>
          </div>
          <div className={styles.anytime_button_group}>
            <button className={`${styles.animate} ${styles.primary_btn}`}>
              <span className={styles.appStore}></span>
              <label>
                Download on the <small>App Store</small>
              </label>
            </button>
            <button className={`${styles.animate} ${styles.primary_btn}`}>
              <span className={styles.playStore}></span>
              <label>
                Download on the <small>Google Play</small>
              </label>
            </button>
          </div>
        </Container>
      </section>
      <Footer />
    </>
  );
}
