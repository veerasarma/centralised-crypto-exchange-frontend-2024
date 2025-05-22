import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import {
    Table
} from 'react-bootstrap';
// import service
import { apiGetTrnxHistory } from '../../services/Wallet/WalletService'
//import lib
import { dateTimeFormat } from '../../lib/dateTimeHelper';
import { transactionStatus } from '../../lib/displayStatus';
import { capitalize } from '../../lib/stringCase';
import { useTheme } from 'next-themes';
import Image from 'next/image';
//import component
const Pagination = dynamic(() => import('../../lib/pagination'), { ssr: false });



export default function DepositHistory() {
    // function
    // state
    const [currentPage, setCurrentPage] = useState(1);
    const [count, setCount] = useState(0);
    const [record, setRecord] = useState<any>({ 'data': [], 'count': 0 })
    const [filter, setFilter] = useState<any>({
        'coin': 'all',
        'paymentType': 'coin_deposit',
        'search': '',
        'page': 1,
        'limit': 5
    })
    const { theme, setTheme } = useTheme();

    const fetchCryptoHistory = async (reqQuery: any) => {
        try {
            const respData: any = await apiGetTrnxHistory('crypto', reqQuery)


            if (respData && respData.data.result.count && respData.data.result.count > 0) {
                const result = respData.data.result;
                setCount(respData.data.result.count)
                let resultArr: any[] = []
                result.data.map((item: any) => {
                    resultArr.push({
                        'date': dateTimeFormat(item.createdAt, 'YYYY-MM-DD HH:mm'),
                        'type': transactionStatus(item.paymentType),
                        'currency': item.coin,
                        'amount': item.amount,
                        'txid': item.txid,
                        'tokenType': item.tokenType == null ? "" : item.tokenType == undefined ? "" : item.tokenType,
                        'status': <div className="textStatusGreen">{capitalize(item.status)}</div>
                    })
                })
                setRecord({
                    'data': resultArr,
                    count: result.count
                })
                return;
            }
            setRecord({
                'data': [],
                count: 0
            })
        } catch (err) {

            setRecord({
                'data': [],
                'count': 0
            })
        }
    }
    useEffect(() => {
        setFilter({ ...filter, page: currentPage })
    }, [currentPage])

    useEffect(() => {
        fetchCryptoHistory(filter)
    }, [filter])
    return (
        <>
            <Table responsive  >
                <thead>
                    <tr>
                        <th>Date & Time</th>
                        <th className='text-start' > Type </th>
                        <th className='text-start'> Currency </th>
                        <th> Amount  </th>
                        <th> Transaction Ref. </th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        record?.data?.length > 0 ? (
                            record.data.map((item: any, index: number) => {
                                return (
                                    <tr key={index}>
                                        <td>{item.date}</td>
                                        <td>{item.type}</td>
                                        <td>{item.currency}</td>
                                        <td>{item.amount}</td>
                                        <td>{item.txid}</td>
                                        <td>{item.status}</td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan={6}>
                                    <div className="d-flex flex-column gap-3 align-items-center m-5">
                                        {theme === "light_theme" ? (
                                            <Image
                                                src="/assets/images/nodata_light.svg"
                                                alt="No data"
                                                className="img-fluid"
                                                width={96}
                                                height={96}
                                            />
                                        ) : (
                                            <Image
                                                src="/assets/images/nodata.svg"
                                                alt="No data"
                                                className="img-fluid"
                                                width={96}
                                                height={96}
                                            />
                                        )}
                                        <h6>No Records Found</h6>
                                    </div>
                                </td>
                            </tr>
                        )
                    }
                </tbody>

            </Table>
            <Pagination
                currentPage={currentPage}
                totalCount={count}
                pageSize={5}
                onPageChange={(page: number) => setCurrentPage(page)}
            />
        </>
    )
}