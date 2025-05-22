import Head from "next/head";
import styles from "@/styles/common.module.css";
import React, { useState, useEffect } from "react";
import clsx from "classnames";
import Image from "next/image";
import config from "../config/index";
import Footer from "@/components/footer";
import Mainnavbar from "@/components/navbar";

function Terms() {
  return (
    <>
      <Mainnavbar />
      <div className={styles.page_box}>
        <main>
          <div className="container">
            <div className={styles.privacy}>
              <div>
                <h2 className={styles.h2tag}>B5 EXCHANGE User Agreement</h2>

                {/* <p className="text-end" >[Last Update: 2021.08.12]</p> */}

                <p>
                  B5 EXCHANGE (hereinafter referred to as &quot;the
                  company&quot;) is a company incorporated in singapore under
                  the laws of singapore and operates the website&nbsp;
                  <a href={config.FRONT_URL}>B5 EXCHANGE</a> (hereinafter
                  referred to as &quot;this Website&quot; or &quot;the
                  Website&quot;), which is a platform dedicated to the
                  transaction of digital assets and the provision of related
                  services (hereinafter referred to as &quot;the Service&quot;).
                  For the convenience of wording in this Agreement, the Company
                  and the Website are referred to as &quot;we&quot; or other
                  applicable forms of first-person pronouns in this Agreement.
                  All natural persons or other subjects who log onto this
                  Website shall be users of this Website. For the convenience of
                  wording in this Agreement, the users are referred to as
                  &quot;you&quot; or any other applicable forms of the
                  second-person pronouns. For the convenience of wording in this
                  Agreement, you and B5 EXCHANGE are collectively referred to as
                  &quot;both parties&quot;, and individually as &quot;one
                  party&quot;. For the convenience of the Users, all content on
                  this Website may be available in multiple languages. In case
                  of any conflict between different language versions of such
                  content or any omission in any language version, the English
                  version of such content shall prevail.
                </p>

                <h5>Important reminder:</h5>

                <h5>We hereby remind you that:</h5>

                <p>
                  &bull; The digital assets themselves are not offered by any
                  financial institution, corporation or this Website;
                </p>
                <p>
                  {" "}
                  &bull;The digital asset market is new and unconfirmed, and
                  will not necessarily expand;
                </p>
                <p>
                  &bull; Digital assets are primarily used by speculators, and
                  are used relatively less on retail and commercial markets;
                  digital asset transactions are highly risky, due to the fact
                  that they are traded throughout the day without limits on the
                  rise or fall in price, and market makers and global government
                  policies may cause major fluctuations in their prices;
                </p>
                <p>
                  &bull; The Company may suspend or terminate your account or
                  use of the Service, or the processing of any digital asset
                  transaction, at any time if it determines in its sole
                  discretion that you have violated this Agreement or that its
                  provision or your use of the Service in your jurisdiction is
                  unlawful. USE OF THE SERVICE BY PERSONS LOCATED IN THE UNITED
                  STATES OF AMERICA AND JAPAN IS PROHIBITED.
                </p>

                <p>
                  Digital assets trading is highly risky and therefore not
                  suitable for the vast majority of people. You acknowledge and
                  understand that investment in digital assets may result in
                  partial or total loss of your investment and therefore you are
                  advised to decide the amount of your investment on the basis
                  of your loss-bearing capacity. You acknowledge and understand
                  that digital assets may generate derivative risks. Therefore,
                  if you have any doubt, you are advised to seek assistance from
                  a financial adviser first. Furthermore, aside from the
                  above-mentioned risks, there may also be unpredictable risks.
                  Therefore, you are advised to carefully consider and use clear
                  judgement to assess your financial position and the
                  abovementioned risks before making any decisions on buying and
                  selling digital assets; any and all losses arising therefrom
                  will be borne by you and we shall not be held liable in any
                  manner whatsoever.
                </p>

                <h5>You are hereby informed that:</h5>

                <p>
                  &bull; You understand that this Website is only intended to
                  serve as a venue for you to obtain digital asset information,
                  find trading counterparties, hold negotiations on and effect
                  transactions of digital assets. This Website does not
                  participate in any of your transactions, and therefore you
                  shall, at your sole discretion, carefully assess the
                  authenticity, legality and validity of relevant digital assets
                  and/or information, and solely bear the responsibilities and
                  losses that may arise therefrom.
                </p>
                <p>
                  &bull; All opinions, information, discussions, analyses,
                  prices, advice and other information on this Website are
                  general market reviews and do not constitute any investment
                  advice. We do not bear any loss arising directly or indirectly
                  from reliance on the above mentioned information, including
                  but not limited to, any loss of profits.
                </p>
                <p>
                  &bull; The content of this Website may be changed from time to
                  time and at any time without notice, and we have taken
                  reasonable measures to ensure the accuracy of the information
                  on the Website; however, we do not guarantee the degree of
                  such accuracy, or bear any loss arising directly or indirectly
                  from the information on this Website or from any delay or
                  failure caused by failure to link up with the internet,
                  transmit or receive any notice and information
                </p>
                <p>
                  &bull; Using internet-based trading systems also involves
                  risks, including but not limited to failures in software,
                  hardware or Internet links, etc. In view of the fact that we
                  cannot control the reliability and availability of the
                  Internet, we will not be responsible for any distortion, delay
                  and link failure.
                </p>
                <p>
                  &bull;&nbsp;
                  <a href={config.FRONT_URL}>B5 EXCHANGE</a> is the sole
                  official external information release platform for this
                  Website;
                </p>
                <p>
                  &bull; It is prohibited to use this Website to engage in any
                  illegal transaction activities or illegitimate activities,
                  such as money laundering, smuggling and commercial bribery. In
                  the event that any suspected illegal transaction activities or
                  illegitimate activities is uncovered, this Website will adopt
                  all available measures, including but not limited to freezing
                  the offender&rsquo;s account, notifying relevant authorities,
                  etc., and we will not assume any of the responsibilities
                  arising therefrom and reserve the right to hold relevant
                  persons accountable;
                </p>
                <p>
                  &bull; It is prohibited to use this Website for the purpose of
                  malicious manipulation of the market, improper transactions or
                  any other illicit trading activities. Where any of such
                  illicit trading activities is uncovered, this Website will
                  adopt such preventive and protective measures as warning,
                  restricting trading and closing accounts against any and all
                  such malicious manipulation of prices, maliciously influencing
                  the trading system and any other illicit behaviours; we do not
                  assume any of the responsibilities arising therefrom and
                  reserve the right to hold relevant persons accountable.
                </p>

                <h5>1. General Provisions</h5>

                <p>
                  1.1 The User Agreement (hereinafter referred to as &quot;this
                  Agreement&quot; or &quot;these terms and conditions&quot;)
                  consists of the main body, Terms of Privacy, Understanding
                  Your client and Anti-money-laundering Policy, as well as any
                  rules, statements, instructions, etc. that this Website has
                  published or may publish in the future.
                </p>
                <p>
                  1.2 Before using the services offered by this Website, you
                  shall read this Agreement carefully, and consult a
                  professional lawyer if you have any doubt or as may be
                  otherwise necessary. If you do not agree to the terms and
                  conditions of this Agreement and/or any change made thereto
                  from time to time and at any time, please immediately stop
                  using the service provided by this Website or stop logging
                  onto this Website. Upon your logging into this Website or
                  using any service offered by this Website or engaging in any
                  other similar activity, it shall be deemed as having
                  understood and fully agreeing to all terms and conditions of
                  this Agreement, including any and all changes, modifications
                  or alterations that this Website may make to this Agreement
                  from time to time and at any time.
                </p>
                <p>
                  1.3 After filling in the relevant information in accordance
                  with the requirements of this Website, and going through other
                  relevant procedures, you will successfully register yourself
                  as a member of this Website (hereinafter referred to as
                  &quot;Member&quot;); in the process of registration, if you
                  click on the &quot;I Agree&quot;, it shall be deemed that you
                  have reached an agreement with the Company by way of
                  electronic signature; or when you use this Website, you click
                  on the &quot;I Agree&quot; button or a similar button, or if
                  you use the services offered by this Website in any of the
                  ways allowed by this Website, it shall be deemed that you
                  fully understand, agree to and accept all the terms and
                  conditions under this Agreement, and in this case, the absence
                  of your handwritten signature will not affect the legal
                  binding force that this Agreement may have on you.
                </p>
                <p>
                  1.4 After you become a member of this Website, you will
                  receive a member account and corresponding password, which
                  shall be properly kept by you as a member of this Website;
                  Members shall be liable for all activities and events carried
                  out through their accounts.
                </p>
                <p>
                  1.5 You cannot engage in trading on the digital asset trading
                  platform provided by this Website and gain access to the
                  services that are exclusively available to members in
                  accordance with the rules and regulations of this Website,
                  unless and until you become a member of this Website; if you
                  are not a member of this Website, you can only log in to and
                  browse the Website and have access to other services as are
                  permitted by the rules and regulations of this Website.
                </p>
                <p>
                  1.6 Upon registering yourself as a member of this Website and
                  using any of the services and functions offered by this
                  Website, it shall be deemed that you have read, understood
                  this Agreement, and:
                </p>
                <p>
                  1.6.1 accepted to be bound by all terms and conditions of this
                  Agreement;
                </p>
                <p>
                  1.6.2 You confirm that you have attained the age of 16, or
                  another statutory age for entering into contracts as is
                  required by a different applicable law, and your registration
                  with this Website, purchase or sale via this Website, release
                  information on this Website and other behaviours indicating
                  your acceptance of the Services offered by this Website shall
                  comply with the relevant laws and regulations of the sovereign
                  state or region that has jurisdiction over you, and you
                  confirm that you have sufficient capacity to accept these
                  terms and conditions, enter into transactions and to use this
                  Website for digital asset transactions.
                </p>
                <p>
                  1.6.3 You undertake that all your digital assets involved in
                  transactions hereunder are legally acquired and owned by you.
                </p>
                <p>
                  1.6.4 You agree to undertake any and all liabilities for your
                  own transaction and non-transaction activities as well as any
                  and all profits and losses therefrom.
                </p>
                <p>
                  1.6.5 You confirm that the information provided at the time of
                  registration is true and accurate.
                </p>
                <p>
                  1.6.6 You agree to comply with any and all relevant laws,
                  including the reporting of any transaction profits for tax
                  purposes.
                </p>
                <p>
                  1.6.7 You agree to always refrain from engaging in or
                  participating in any act or activity that damages the
                  interests of this Website or the Company, whether or not in
                  connection with the Services provided by this Website.
                </p>
                <p>
                  1.6.8 This Agreement is only binding on the rights and
                  obligations between you and us, and does not involve legal
                  relations and legal disputes arising from and relating to the
                  transaction of digital assets between the users of this
                  Website, and between other websites and you.
                </p>

                <h5>2. Amendment of this Agreement</h5>

                <p>
                  We reserve the right to amend this Agreement from time to
                  time, and disclose such amendment by way of announcement on
                  the Website without sending a separate notice to you on your
                  rights. The date when the amendment is made will be indicated
                  on the first page of the amended agreement. The amended
                  agreement will take effect immediately upon announcement on
                  the Website. You shall browse this Website from time to time
                  and follow information on the time and content of amendments,
                  if any, made to this Agreement. If you do not agree with the
                  amendments, you shall stop using the services offered by this
                  Website immediately; if you continue to use the services
                  offered by this Website, it shall be deemed that you accept
                  and agree to be bound by the amended agreement.
                </p>

                <h5>3. Registration</h5>

                <p>
                  3.1 Eligibility for Registration You confirm and promise that:
                  you shall be a natural person, legal person or other
                  organisation with the ability to sign this Agreement and the
                  ability to use the services of this Website, as is provided by
                  applicable laws, when you complete the registration process or
                  when you use the services offered by this Website in any other
                  manner as is otherwise permitted by this Website. Upon
                  clicking on the button indicating that you agree to register,
                  it shall be deemed that you yourself or your authorised agent
                  agrees to the content of this Agreement and your authorised
                  agent will register with this Website and use the services
                  offered by this Website on your behalf. If you are not a
                  natural person, legal person or organisation with the
                  abovementioned ability, you and your authorised agent shall
                  bear all the consequences of that, and the company reserves
                  the right to cancel or permanently freeze your account and to
                  hold you and your authorised agent accountable.
                </p>
                <p>
                  3.2 Purpose of Registration You confirm and promise that you
                  do not register with this Website for the purpose of violating
                  any of the applicable laws or regulations or undermining the
                  order of digital asset transactions on this Website.
                </p>
                <p>3.3 Registration Process</p>
                <p>
                  3.3.1 You agree to provide a valid email address, a mobile
                  phone number and other information in accordance with the
                  requirements on the user registration page of this Website.
                  You can use the email address, mobile phone number or any
                  other manner permitted by this Website to log in to this
                  Website. Where it is necessary and in accordance with the
                  requirements of applicable laws and regulations of relevant
                  jurisdictions, you shall provide your real name, identity card
                  and other information required by applicable laws,
                  regulations, the Terms of Privacy, and anti-money-laundering
                  terms, and constantly update your registration data so that
                  they will be timely, detailed and accurate as is required. All
                  of the original typed data will be referenced as registration
                  information. You shall be responsible for the authenticity,
                  integrity and accuracy of such information and bear any direct
                  or indirect loss and adverse consequences arising out of it.
                </p>
                <p>
                  3.3.2 If any of the applicable laws, regulations, rules,
                  orders and other regulatory documents of the sovereign country
                  or region in which you are based requires that mobile phone
                  accounts must be based on real names, you hereby confirm that
                  the mobile phone number you provide for registration purposes
                  has gone through the real-name registration procedure. If you
                  cannot provide such a mobile phone number as is required, any
                  direct or indirect losses and adverse consequences arising
                  therefrom and affecting you shall be borne by you.
                </p>
                <p>
                  3.3.3 After you provide the required registration information
                  in a legal, complete and valid manner and such information
                  passes relevant verification, you shall have the right to
                  obtain an account and a password of this Website. Upon
                  obtaining such account and password, your registration shall
                  be deemed as successful and you can log into this Website as a
                  member thereof.
                </p>
                <p>
                  3.3.4 You agree to receive emails and/or short messages sent
                  by this Website related to the management and operation
                  thereof.
                </p>

                <h5>4. Services</h5>

                <p>
                  This Website only provides online transaction platform
                  services for you to engage in digital asset trading activities
                  through this Website (including but not limited to the digital
                  asset transactions etc.). This Website does not participate in
                  the transaction of digital assets as a buyer or seller; This
                  Website does not provide any services relating to the
                  replenishment and withdrawal of the legal currency of any
                  country.
                </p>
                <p>4.1 Content of Services</p>
                <p>
                  4.1.1 You have the right to browse the real-time quotes and
                  transaction information of digital asset products on this
                  Website, to submit digital asset transaction instructions and
                  to complete the digital asset transaction through this
                  Website.
                </p>
                <p>
                  4.1.2 You have the right to view information under the member
                  accounts on this Website and to apply the functions provided
                  by this Website.
                </p>
                <p>
                  4.1.3 You have the right to participate in the website
                  activities organised by this Website in accordance with the
                  rules of activities posted on this Website.
                </p>
                <p>
                  4.1.4 Other services that this Website promises to offer to
                  you.
                </p>
                <p>
                  4.2 Service Rules You undertake to comply with the following
                  service rules of this Website:
                </p>
                <p>
                  4.2.1 You shall comply with the provisions of applicable laws,
                  regulations, rules, and policy requirements, and ensure the
                  legality of the source of all digital assets in your account,
                  and shall refrain from engaging in any illegal activities or
                  other activities that damages the rights and interests of this
                  Website or any third party, such as sending or receiving
                  information that is illegal, illicit or infringes on the
                  rights and interests of any other person, sending or receiving
                  pyramid scheme information or information or remarks causing
                  other harms, unauthorised use or falsification of the email
                  header information of this Website, inter alia.
                </p>
                <p>
                  4.2.2 You shall comply with applicable laws and regulations
                  and properly use and keep your account in this Website and
                  login password, password of your financial transactions, and
                  the mobile phone number bound with your account that you
                  provide upon registration of your account, as well as the
                  security of the verification codes received via your mobile
                  phone. You shall be solely responsible for any and all your
                  operations carried out using your account with this Website
                  and login password, financial transaction password,
                  verification codes sent to your mobile phone, as well as all
                  consequences of such operations. When you find that your
                  account with this Website, your login password, financial
                  transaction password, or mobile phone verification codes is
                  used by any unauthorised third party, uncover any other
                  problem relating to the security of your account, you shall
                  inform this Website in a prompt and effective manner, and
                  request this Website to temporarily suspend the services to
                  your account with this Website. This Website shall have the
                  right to take action on your request within a reasonable time;
                  nonetheless, this Website does not bear any liability for the
                  consequences that have arisen before such action is taken,
                  including but not limited to any loss that you may sustain.
                  You may not assign your account with this Website to any other
                  person by way of donation, lending, leasing, transfer or
                  otherwise without the consent of this Website.
                </p>
                <p>
                  4.2.3 You agree to take responsibility for all activities
                  (including but not limited to information disclosure,
                  information release, online click-approving or submission of
                  various agreements on rules, online renewal of agreements or
                  purchase service) using your account and password with this
                  Website.
                </p>
                <p>
                  4.2.4 In your digital asset transactions on this Website, you
                  may not maliciously interfere with the normal proceeding of
                  the digital asset transaction or disrupt the transaction
                  order; you may not use any technical means or other means to
                  interfere with the normal operation of this Website or
                  interfere with the other users&apos; use of the services; you
                  may not maliciously defame the business goodwill of this
                  Website on the ground of falsified fact.
                </p>
                <p>
                  4.2.5 If any dispute arises between you and any other user in
                  connection with online transactions, you may not resort to any
                  means other than judicial or governmental means to request
                  this Website to provide relevant information.
                </p>
                <p>
                  4.2.6 All taxes payable as well as all fees relating to
                  hardware, software and services that are incurred by you in
                  the course of using the services provided by this Website
                  shall be solely borne by you.
                </p>
                <p>
                  4.2.7 You shall abide by this Agreement and other terms of
                  service and operating rules that this Website may release from
                  time to time, and you have the right to terminate your use of
                  the services provided by this Website at any time.4.3 Product
                  Rules
                </p>
                <p>
                  4.3.1 Rules for trading products You undertake that in the
                  process in which you log into this Website and engage in
                  transactions with other users through this Website, you will
                  properly comply with the following transaction rules.
                </p>
                <p>
                  4.3.1.1 Browsing transaction information When you browse the
                  transaction information on this Website, you should carefully
                  read all the content in the transaction information, including
                  but not limited to the price, consignment, handling fee,
                  buying or selling direction, and you shall accept all the
                  contents contained in the transaction information before you
                  may click on the button to proceed with the transaction.
                </p>
                <p>
                  4.3.1.2 Submission of Commission After browsing and verifying
                  the transaction information, you may submit your transaction
                  commissions. After you submit the transaction commission, it
                  shall be deemed that you authorise this Website to broker you
                  for the corresponding transactions, and this Website will
                  automatically complete the matchmaking operation when there is
                  a transaction proposal that meets your price quotation,
                  without prior notice to you.
                </p>
                <p>
                  4.3.1.3 Accessing transaction details You can check the
                  corresponding transaction records in the transaction
                  statements by the Management Center, and confirm your own
                  detailed transaction records.
                </p>
                <p>
                  &bull; 4.3.1.4 Revoking/modifying transaction commission. You
                  have the right to revoke or modify your transaction commission
                  at any time before the transaction is concluded.
                </p>

                <h5>5. Rights and Obligations of this Website</h5>

                <p>
                  5.1 If you do not have the registration qualifications agreed
                  on in this Agreement, this Website shall have the right to
                  refuse to allow you to register; if you have already
                  registered, this Website shall have the right to revoke your
                  member account, and this Website reserves the right to hold
                  you or your authorised agent accountable. Furthermore, this
                  Website reserves the right to decide whether to accept your
                  application for registration under any other circumstances.
                </p>
                <p>
                  5.2 When this Website finds at its sole discretion that you or
                  your associated account user is not suitable for high-risk
                  investment, this Website shall have the right to suspend or
                  terminate the use of your account and all associated accounts
                  thereof.
                </p>
                <p>
                  5.3 When this Website finds out that the user of an Account is
                  not the initial registrant of that Account, it shall have the
                  right to suspend or terminate the user&apos;s access to that
                  Account.
                </p>
                <p>
                  5.4 Where by means of technical testing or manual sampling,
                  among others, this Website reasonably suspects that the
                  information you provide is wrong, untrue, invalid or
                  incomplete, this Website shall have the right to notify you to
                  correct or update the information, or suspend or terminate its
                  supply of the services to you.
                </p>
                <p>
                  5.5 This Website shall have the right to correct any
                  information displayed on this Website when it uncovers any
                  obvious error in such information.
                </p>
                <p>
                  5.6 This Website reserves the right to modify, suspend or
                  terminate the Services offered by this Website, at any time,
                  and the right to modify or suspend the Service without prior
                  notice to you; if this Website terminates one or more of the
                  Services offered by this Website, such termination by this
                  Website will take effect on the date of announcement of such
                  termination on the Website.
                </p>
                <p>
                  5.7 This Website shall take necessary technical means and
                  management measures to ensure the normal operation of this
                  Website, and shall provide a necessary and reliable trading
                  environment and transaction services, and shall maintain the
                  order of digital assets trading.
                </p>
                <p>
                  5.8 If you fail to log into this Website using your member
                  account number and password for an uninterrupted period of one
                  year, this Website shall have the right to revoke your
                  account. After your account is revoked, this Website shall
                  have the right to offer the member name represented by such
                  account to other applicants for membership.
                </p>
                <p>
                  5.9 This Website shall ensure the security of your digital
                  assets by strengthening technical input and enhancing security
                  precautions, and is under the obligation to notify you in
                  advance of the foreseeable security risks in your account.
                </p>
                <p>
                  5.10 This Website shall have the right to delete all kinds of
                  content and information which does not conform to laws and
                  regulations or the rules of this Website at any time, and
                  exercise of this right by this Website is not subject to a
                  prior notice to you.
                </p>
                <p>
                  5.11 This Website shall have the right to, in accordance with
                  the applicable laws, administrative regulations, rules, orders
                  and other regulatory documents of the sovereign country or
                  region where you are based, request to you for more
                  information or data, and to take reasonable measures to meet
                  the requirements of the local standards, and you have the
                  obligation to provide proper assistance to such measures; this
                  Website shall have the right to suspend or permanently
                  terminate your access to this Website as well as part or all
                  of the services offered by this Website.
                </p>

                <h5>6. Indemnity</h5>

                <p>
                  6.1 Under any circumstance, our liability for your direct
                  damage will not exceed the total cost incurred by your three
                  (3) months&apos; use of services offered by this Website.
                </p>
                <p>
                  6.2 Shall you breach this Agreement or any applicable law or
                  administrative regulation, you shall pay to us at least US$
                  Two million in compensation and bear all the expenses in
                  connection with such breach (including attorney&apos;s fees,
                  among others). If such compensation cannot cover the actual
                  loss, you shall make up for the difference.
                </p>

                <h5>7. The Right to Injunctive Relief</h5>

                <p>
                  Both you and we acknowledge that common law remedies for
                  breach of agreement or possible breach of contract may be
                  insufficient to cover all the losses that we sustain;
                  therefore, in the event of a breach of contract or a possible
                  breach of contract, the non-breaching party shall have the
                  right to seek injunctive relief as well as all other remedies
                  that are permitted under common law or equity.
                </p>

                <h5>8. Limitation and Exemption of Liability</h5>

                <p>
                  8.1 You understand and agree that under no circumstance will
                  we be held liable for any of the following events:
                </p>
                <p>8.1.1 loss of income;</p>
                <p>8.1.2 loss of transaction profits or contractual losses;</p>
                <p>8.1.3 disruption of the business</p>
                <p>8.1.4 loss of expected currency losses</p>
                <p>8.1.5 loss of information</p>
                <p>
                  8.1.6 loss of opportunity, damage to goodwill or reputation
                </p>
                <p>8.1.7 damage or loss of data;</p>
                <p>
                  8.1.8 cost of purchasing alternative products or services;
                </p>
                <p>
                  8.1.9 any indirect, special or incidental loss or damage
                  arising from any infringement (including negligence), breach
                  of contract or any other cause, regardless of whether or not
                  such loss or damage may reasonably be foreseen by us, and
                  regardless of whether or not we are notified in advance of the
                  possibility of such loss or damage.
                </p>
                <p>
                  8.1.10 Items 8.1.1 to 8.1.9 are independent of each other.
                </p>
                <p>
                  8.2 You understand and agree that we shall not be held liable
                  for any damages caused by any of the following events:
                </p>
                <p>
                  8.2.1 Where we are properly justified in believing that your
                  specific transactions may involve any serious violation or
                  breach of law or agreement;
                </p>
                <p>
                  8.2.2 Where we are reasonably justified in believing that your
                  conduct on this Website is suspected of being illegal or
                  immoral;
                </p>
                <p>
                  8.2.3 The expenses and losses arising from the purchase or
                  acquisition of any data, information or transaction, etc.
                  through the services offered by this Website;
                </p>
                <p>
                  8.2.4 Your misunderstanding of the Services offered by this
                  Website;
                </p>
                <p>
                  8.2.5 Any other losses related to the services provided by
                  this Website, which cannot be attributed to us.
                </p>
                <p>
                  8.3 Where we fail to provide the Services or delay in
                  providing such Services due to information network equipment
                  maintenance, information network connectivity failures, errors
                  in computer, communications or other systems, power failures,
                  weather conditions, unexpected accidents, industrial actions,
                  labour disputes, revolts, uprisings, riots, lack of
                  productivity or production materials, fires, floods, storms,
                  explosions, wars, failure on the part of banks or other
                  partners, collapse of the digital asset market, actions by
                  government, judicial or administrative authorities, other acts
                  that are not within our control or beyond our inability to
                  control, or due to causes on the part of third parties, we
                  shall not assume any responsibility for such failure to
                  provide service or delay in providing services, or for the
                  resultant loss you may sustain as a result of such failure or
                  delay.
                </p>
                <p>
                  8.4 We cannot guarantee that all the information, programs,
                  texts, etc. contained in this Website are completely safe,
                  free from the interference and destruction by any malicious
                  programs such as viruses, trojans, etc., therefore, your
                  log-into this Website or use of any services offered by this
                  Website, download of any program, information and data from
                  this Website and your use thereof are your personal decisions
                  and therefore you shall bear the any and all risks and losses
                  that may possibly arise.
                </p>
                <p>
                  8.5 We do not make any warranties and commitments in
                  connection with any of the information, products and business
                  of any third party websites linked to this Website, as well as
                  any other forms of content that do not belong to us; your use
                  any of the services, information, and products provided by a
                  third party website is your personal decision and therefore
                  you shall assume any and all the responsibilities arising
                  therefrom.
                </p>
                <p>
                  8.6 We do not make any explicit or implicit warranties
                  regarding your use of the Services offered by this Website,
                  including but not limited to the applicability, freedom from
                  error or omission, consistency, accuracy, reliability, and
                  applicability to a specific purpose, of the services provided
                  by this Website. Furthermore, we do not make any commitment or
                  guarantee in connection with the validity, accuracy,
                  correctness, reliability, quality, stability, integrity and
                  timeliness of the technology and information covered by the
                  services offered by this Website. Whether to log in this
                  Website or use the services provided by this Website is your
                  personal decision and therefore you shall bear all the risks
                  and possible losses arising from such decision. We do not make
                  any explicit or implicit warranties in connection with the
                  market, value and price of digital assets; you understand and
                  acknowledge that the digital asset market is unstable, that
                  the price and value of assets may fluctuate or collapse at any
                  time, and that the transaction of digital assets is based on
                  your personal free will and decision and therefore you shall
                  assume any and all risks and losses that may possible arise
                  therefrom.
                </p>
                <p>
                  8.7 The guarantees and undertakings specified in this
                  Agreement shall be the only guarantee and statements that we
                  make in connection with the Services provided by us under this
                  Agreement and through this Website and shall supersede any and
                  all the warranties and commitments arising in any other way
                  and manner, whether in writing or in words, express or
                  implied. All these guarantees and statements represent only
                  our own commitments and undertakings and do not guarantee any
                  third party&apos;s compliance with the guarantees and
                  commitments contained in this Agreement.
                </p>
                <p>
                  8.8 We do not waive any of the rights not mentioned in this
                  Agreement and to the maximum extent permitted by the
                  applicable law, to limit, exempt or offset our liability for
                  damages.
                </p>
                <p>
                  8.9 Upon the registration of your account with this Website,
                  it shall be deemed that you approve any and all operations
                  performed by us in accordance with the rules set forth in this
                  Agreement, and any and all risks arising from such operations
                  shall be assumed by you.
                </p>

                <h5>9. Termination of Agreement</h5>
                <p>
                  9.1 This Website shall have the right to terminate all
                  Services offered by this Website to you in accordance with
                  this Agreement, and this Agreement shall terminate on the date
                  of termination of all services offered by this Website to you.
                </p>
                <p>
                  9.2 After the termination of this Agreement, you do not have
                  the right to require this Website to continue to provide you
                  with any service or perform any other obligation, including,
                  but not limited to, requesting this Website to keep or
                  disclose to you any information in your former original
                  account, or to forward to you or any third party any
                  information therein that is not read or sent.
                </p>
                <p>
                  9.3 The termination of this Agreement shall not prevent the
                  observant party from demanding the breaching party to assume
                  other liabilities.
                </p>

                <h5>10. Intellectual Property</h5>

                <p>
                  10.1 All intellectual achievements included in this Website,
                  including, but not limited to, website logos, databases,
                  website design, text and graphics, software, photos, videos,
                  music, sounds, and any combinations of the aforementioned
                  files, and the intellectual property rights of software
                  compilation, associated source code and software (including
                  small applications and scripts) shall be owned by this
                  Website. You may not copy, modify, copy, transmit or use any
                  of the foregoing materials or content for commercial purposes.
                </p>
                <p>
                  10.2 All rights contained in the name of this Website
                  (including but not limited to business goodwill and
                  trademarks, logos) shall be owned by the Company.
                </p>
                <p>
                  10.3 Upon accepting this Agreement, it shall be deemed that
                  you, on the basis of your own free will, have transferred and
                  assigned exclusively and free of charge to this Website all
                  copyright of any form of information that you publish on this
                  Website, including, but not limited to copyrights,
                  distribution rights, lease rights, exhibition rights,
                  performance rights, projection rights, broadcasting rights,
                  information network dissemination rights, shooting rights,
                  adaptation rights, translation rights, compilation rights and
                  other transferable rights that copyright owners are entitled
                  to, and this Website shall have the right to sue for any
                  infringement on such copyright and obtain full compensation
                  for such infringement. This Agreement shall apply to any
                  content that is published by you on this Website and is
                  protected by copyright law, regardless of whether the content
                  is generated before or after the signing of this Agreement.
                </p>
                <p>
                  10.4 You shall not illegally use or dispose of the
                  intellectual property rights of this Website or any other
                  person during your use of the services offered by this
                  Website. For any information that you publish on this Website,
                  you may not publish or authorise other websites (or media) to
                  use such information in any manner whatsoever.
                </p>
                <p>
                  10.5 Your log into this Website or use of any of the services
                  offered by this Website shall not be deemed as our transfer of
                  any intellectual property to you.
                </p>

                <h5>11. Information Protection</h5>

                <p>
                  Regarding the collection and use of your personal information
                  and storage protection, the privacy policy publicised on this
                  website shall prevail.
                </p>

                <h5>12. Calculation</h5>

                <p>
                  All the transaction calculations are verified by us, and all
                  the calculation methods have been posted on the Website, but
                  we can not ensure that your use of this Website will not be
                  disturbed or free from errors.
                </p>

                <h5>13. Export Control</h5>

                <p>
                  You understand and acknowledge that in accordance with
                  relevant laws of Singapore, you shall not export, re-export,
                  import, or transfer any material (including software) on this
                  Website; therefore, you hereby undertake that you will not
                  voluntarily commit or assist or participate in any of the
                  above export or related transfer or other violations of
                  applicable laws and regulations; if you uncover any of the
                  aforementioned events, you will report to us and assist us in
                  handling them.
                </p>

                <h5>14. Transfer</h5>

                <p>
                  The rights and obligations agreed in this Agreement shall be
                  equally binding on the assignees, the heirs, executors, and
                  administrators of the parties hereto who benefit from the
                  rights and obligations. Without our consent, you may not
                  transfer to any third party any of your rights or obligations
                  hereunder, provided, however, we may, at any time, assign our
                  rights and obligations under this Agreement to any third party
                  with thirty (30) days&apos; notice to you.
                </p>

                <h5>15. Severability</h5>

                <p>
                  If any provision of this Agreement is found unenforceable,
                  invalid or illegal by any court of competent jurisdiction, the
                  validity of the remaining provisions of this Agreement shall
                  not be affected.
                </p>

                <h5>16. No Agency</h5>

                <p>
                  Nothing in this Agreement shall be deemed to have created,
                  implied or otherwise treated us as your agent, trustee, or
                  other representatives unless it is provided otherwise in this
                  Agreement.
                </p>

                <h5>17. Waiver</h5>

                <p>
                  Our or your waiver of the right to hold the other party liable
                  for breaches of agreement or any other liability as is agreed
                  upon in this Agreement shall not be construed or deemed as a
                  waiver of the right to hold the other party for other breaches
                  of contract; a failure to exercise any right or remedy shall
                  not be construed in any way as a waiver of such right or
                  remedy.
                </p>

                <h5>18. Headings</h5>

                <p>
                  All headings herein are exclusively for the convenience of
                  wording and are not intended to expand or limit the content or
                  scope of the terms and conditions of this Agreement.
                </p>

                <h5>19. Applicable Law</h5>

                <p>
                  This Agreement in its entirety is a contract concluded under
                  the laws of Singapore, and relevant laws of Singapore shall
                  apply to its establishment, interpretation, content and
                  enforcement; Any claims or actions arising out of or relating
                  to the Services agreed in this Agreement shall be governed and
                  interpreted and enforced in accordance with the laws of
                  Singapore. For the avoidance of doubt, this Clause shall be
                  expressly applicable to any tort claim against us. The
                  competent court or forum for any claim or action against us or
                  in relation to us shall be in Singapore. You have
                  unconditional access to exclusive jurisdiction in court
                  proceedings and appeals in the courts of Singapore. You also
                  unconditionally agree that the venue or competent court for
                  any dispute or problem relating to this Agreement or any claim
                  and proceeding arising from this Agreement shall be
                  exclusively in Singapore. If any other business of this
                  Website is subject to any special agreement on jurisdiction,
                  such agreement shall prevail. The Doctrine of Forum
                  Non-Conveniens does not apply to the court of choice under
                  these Terms of Service.
                </p>

                <h5>
                  20. Entry into Force and Interpretation of the Agreement
                </h5>

                <p>
                  20.1 This Agreement shall enter into force when you click
                  through the registration page of this Website, complete the
                  registration procedures, obtain your account number and
                  password of this Website, and shall be binding on you and this
                  Website.
                </p>
                <p>
                  20.2 The ultimate power of interpretation of this Agreement
                  shall be vested in this Website.
                </p>
                <h3 className="text-center mb-3">
                  Know-your-customers and Anti-Money Laundering Policies
                </h3>
                <h5>1. Preamble</h5>

                <p>
                  1.1 We ensure that we comply with know-your-customer and
                  anti-money-laundering laws and regulations, and will not
                  knowingly violate know-your-customers and
                  anti-money-laundering policies. To the extent of our
                  reasonable control, we will adopt necessary measures and
                  technology to provide you with Services that are safe and
                  secure, so as to protect you against the loss caused by money
                  laundering to the greatest extent possible.
                </p>
                <p>
                  1.2 Our know-your-customer and anti-money-laundering policies
                  are a comprehensive system of international policies,
                  including the know-your-customer and anti-money-laundering
                  policies of the jurisdictions to which you are subject to. Our
                  robust compliance framework ensures that we meet regulatory
                  requirements and regulatory standards on both the local and
                  global levels, and ensure the operational sustainability of
                  our website.
                </p>

                <h5>
                  2. Content of Our Know-Your-Customer and Anti-Money-Laundering
                  Policies
                </h5>

                <p>
                  2.1 We promulgate and update know-your-customers and
                  anti-money-laundering policies to meet the standards set by
                  relevant laws and regulations;
                </p>
                <p>
                  2.2 We promulgate and update some of the guidelines and rules
                  in connection with the operation of this Website, and our
                  staff will provide you whole-process service in accordance
                  with the guidelines and rules;
                </p>
                <p>
                  2.3 We design and complete the procedures for internal
                  monitoring and transaction control, such as rigorous identity
                  authentication procedures, and form a professional team
                  responsible for anti-money laundering;
                </p>
                <p>
                  2.4 We adopt a risk-prevention-based approach to carry out due
                  diligence and continuous supervision in connection with
                  customers;
                </p>
                <p>2.5 Review and regularly inspect existing transactions;</p>
                <p>
                  2.6 To report suspicious transactions to the competent
                  authorities;
                </p>
                <p>
                  2.7 Proof documents of identity documents, address
                  certificates, and transaction records will be maintained for
                  at least six(6) years; if they are submitted to the regulatory
                  authorities, let it be understood that a separate notice will
                  not be provided to you;
                </p>
                <p>
                  2.8 Credit cards are prohibited throughout the course of the
                  transaction;
                </p>

                <h5>
                  3. Identity Information and the Verification and Confirmation
                  Thereof
                </h5>

                <p>3.1 Identity Information</p>
                <p>
                  3.1.1 In accordance with the laws and regulations of relevant
                  jurisdictions and in light of the nature of the entities
                  concerned, the content of your information as is collected by
                  us may vary, and in principle, we will collect the following
                  information of yours if you register as an individual: Basic
                  personal information: your name, address (and permanent
                  address, if the two are different), date of birth and
                  nationality, and other information available. Identity
                  authentication shall be based on documents issued by the
                  official or other similar authorities, such as passports,
                  identity cards or other identity documents as are required and
                  issued by relevant jurisdictions. The address you provide will
                  be validated in an appropriate manner, such as checking the
                  fare ticket of the means of transportation you use, your
                  interest rate bills, or your voter registration. Valid photo:
                  before you register, you must provide a photograph showing you
                  holding your identity document in front of your chest; Contact
                  information: telephone/mobile phone number and valid email
                  address.
                </p>
                <p>
                  3.1.2 If you are a company or any other type of legal entity,
                  we will collect the following information of yours to
                  determine the final beneficiary of your account or your trust
                  account. Your corporation enrollment and registration
                  certificates of the company; a copy of the articles of
                  association and memorandum of the company; the detailed
                  certification materials of the ownership structure and
                  ownership description of the company, and the decision of the
                  board of directors on designating the authorised agent of the
                  company responsible for the opening and execution of the
                  account of the company with the website; the identity
                  documents of the directors, major shareholders of the company
                  as well as the authorised signatory for the company&apos;s
                  account with the website, as are required to be provided in
                  accordance with relevant rules; the company&apos;s main
                  business address, and the company&apos;s mailing address if it
                  is different from the main business address of the company. If
                  the local address of the company is different from its main
                  business address, the company shall be deemed to be a
                  high-risk customer, and consequently, the company will be
                  required to provide additional documentation. Other
                  certification documents, documents issued by competent
                  authorities, and other documents we may deem necessary in
                  light of the laws and regulations of relevant jurisdictions
                  and in light of the specific nature of your entity.
                </p>
                <p>
                  3.1.3 We only accept English and Chinese versions of your
                  identity information; if your identity information is not in
                  either of the two languages, you shall have your identity
                  information translated into English and duly notarized.
                </p>
                <p>3.2 Confirmation and Verification</p>
                <p>
                  3.2.1 You are required to provide both the front and back
                  sides of your identity documents.
                </p>
                <p>
                  3.2.2 You are required to provide us with a photograph showing
                  you holding your identity documents in front of your chest.
                </p>
                <p>
                  3.2.3 Copies of certification documents shall be checked
                  against the originals thereof. Nonetheless, if a trusted and
                  suitable certifier person can prove that such copies are
                  accurate and comprehensive duplicates of the originals
                  thereof, such copies shall be deemed acceptable. Such
                  certifiers include ambassadors, members of the judiciary,
                  magistrates, etc.
                </p>
                <p>
                  3.2.4 The identification of the ultimate beneficiary and
                  controller of the account shall be based on the determination
                  of which individuals ultimately own or control the direct
                  customer and/or on determining that the ongoing transaction is
                  performed by another person. If you are a business enterprise,
                  the identity of major shareholders thereof (for example, those
                  holding 10 % or more of the voting equity in such a business
                  enterprise) shall be verified. Generally, a shareholder
                  holding 25 % of the shares of the company will be deemed as
                  involving an average level of risk, and the identity of the
                  shareholder shall be verified; a shareholder holding 10 % or
                  more of the voting rights or shares is deemed to be involving
                  a high level of risk, and the identity of the shareholder
                  shall be verified.
                </p>

                <h5>4. Transaction Supervision</h5>

                <p>
                  4.1 We constantly set and adjust daily trading and cash
                  withdrawal limits based on security requirements and the
                  actual state of transactions;
                </p>
                <p>
                  4.2 If the transaction frequently occurs in an account
                  registered by you or is beyond reasonable circumstances, our
                  professional team will assess and determine whether such
                  transaction is suspicious;
                </p>
                <p>
                  4.3 If we identify a specific transaction as suspicious on the
                  basis of our assessment, we may adopt such restrictive
                  measures as suspending the transaction or denying the
                  transaction, and if it is possible, we may even reverse the
                  transaction as soon as possible, and report to the competent
                  authorities, without, however, notifying you;
                </p>
                <p>
                  4.4 We reserve the right to reject registration applications
                  by applicants that do not comply with the international
                  standards against money laundering or who may be regarded as
                  political and public figures; we reserve the right to suspend
                  or terminate a transaction identified as suspicious based on
                  our own assessment, which, however, does not breach any of our
                  obligations and duties to you.
                </p>
              </div>
            </div>
          </div>
          <Footer />
        </main>
      </div>
    </>
  );
}

export default Terms;
