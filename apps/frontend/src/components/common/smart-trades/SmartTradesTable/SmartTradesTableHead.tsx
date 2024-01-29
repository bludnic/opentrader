import type { FC } from "react";
import { ID_COLUMN_MIN_WIDTH } from "src/components/common/smart-trades/SmartTradesTable/constants";

export const SmartTradesTableHead: FC = () => {
  return (
    <thead>
      <tr>
        <th
          style={{
            minWidth: ID_COLUMN_MIN_WIDTH,
            width: "auto",
          }}
        >
          ID
        </th>
        <th
          style={{
            textAlign: "right",
          }}
        >
          Quantity
        </th>
        <th>Price</th>
        <th>Status</th>
        <th>Orders status</th>
        <th>Amount</th>
        <th>Created</th>
        <th>Ref</th>
      </tr>
    </thead>
  );
};
