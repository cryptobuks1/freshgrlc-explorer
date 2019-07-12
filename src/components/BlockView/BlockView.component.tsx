import React from 'react';
import useFetch from 'react-fetch-hook';

import { CoinTickerSymbol } from 'interfaces/ICoinInfo.interface';

import { getBaseUrl } from 'utils/getBaseUrl.util';
import { getCoinInfo, getAllCoins } from 'utils/getCoinInfo.util';
import { Redirect } from 'react-router';

import { CoinInfoContext } from 'context/CoinInfo.context';

import { IBlock } from 'interfaces/IBlock.interface';
import { IBlockTransaction, IExpandedBlockTransaction } from 'interfaces/ITransaction.interface';

import { Banner } from 'components/Banner/Banner.component';
import { Section } from 'components/Section/Section.component';
import { PageLoadAnimation } from 'components/PageLoadAnimation/PageLoadAnimation.component';

import { BlockMetaInfo } from './BlockMetaInfo/BlockMetaInfo.component';
import { TransactionSummary } from './TransactionSummary/TransactionSummary.component';

import classes from './BlockView.module.scss';

interface IProps {
    routeParams: { coin: CoinTickerSymbol; hash: string };
}

export const BlockView: React.FC<IProps> = ({ routeParams }) => {
    const baseUrl = getBaseUrl(routeParams.coin);
    const coinInfo = getCoinInfo(routeParams.coin);
    const { data: block, error } = useFetch<IBlock>(
        `${baseUrl}/blocks/${routeParams.hash}/?expand=transactions,miner,inputs,outputs`
    );
    if (error != null) {
        console.log(error);
        return <Redirect to="/error404" push={false} />;
    }
    return block != null ? (
        <CoinInfoContext.Provider value={coinInfo}>
            <Banner coins={getAllCoins()} preferredCoin={coinInfo ? coinInfo.ticker : undefined} />
            <Section>
                <BlockMetaInfo block={block} />
            </Section>
            <Section header="Included transactions">
                <div className={classes.transactions}>
                    {block.transactions.map((transaction: IBlockTransaction, index: number) => (
                        <TransactionSummary transaction={transaction as IExpandedBlockTransaction} block={block} first={index === 0} />
                    ))}
                </div>
            </Section>
        </CoinInfoContext.Provider>
    ) : (
        <PageLoadAnimation />
    );
};
