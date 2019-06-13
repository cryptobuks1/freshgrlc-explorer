import React, { useMemo } from "react";
import prettyBytes from "pretty-bytes";

import { Cell } from "components/Cell/Cell.component";

import {
  IBlockTransaction,
  IUnconfirmedTransaction,
} from "interfaces/ITransaction.interface";

import classes from "./Transaction.module.scss";

interface IProps {
  transaction: IBlockTransaction | IUnconfirmedTransaction;
  showHeader: boolean;
}

export const Transaction: React.FC<IProps> = React.memo(
  ({ transaction, showHeader }) => {
    const shortenedId = useMemo(
      () =>
        `${transaction.txid.substring(0, 8)}...${transaction.txid.substring(
          transaction.txid.length - 8,
          transaction.txid.length
        )}`,
      [transaction]
    );
    const [byteCount, byteUnit] = useMemo(
      () => prettyBytes(transaction.size).split(" "),
      [transaction]
    );
    return (
      <div className={classes.transaction}>
        {showHeader ? (
          <>
            <Cell label="ID" data={shortenedId} />
            <Cell label="Size" data={byteCount} unit={byteUnit} />
            <Cell label="Value" data={transaction.totalvalue.toFixed(3)} />
          </>
        ) : (
          <>
            <Cell data={shortenedId} />
            <Cell data={byteCount} unit={byteUnit} />
            <Cell data={transaction.totalvalue.toFixed(3)} />
          </>
        )}
      </div>
    );
  },
  (prev, next) =>
    prev.transaction.txid === next.transaction.txid &&
    prev.showHeader === next.showHeader
);
