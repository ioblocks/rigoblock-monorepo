/*

 Copyright 2019 RigoBlock, Rigo Investment Sagl.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.

*/

import { ITotlePrimary } from "../../../utils/exchanges/totle/ITotlePrimary.sol";

//import { Drago } from "../../Drago/Drago.sol";
//import { AuthorityFace as Authority } from "../../authorities/Authority/AuthorityFace.sol";
//import { ExchangesAuthorityFace as ExchangesAuthority } from "../../authorities/ExchangesAuthority/ExchangesAuthorityFace.sol";

pragma solidity 0.5.4;
pragma experimental ABIEncoderV2;

/// @title Totle Primary adapter - A helper contract for the Totle exchange aggregator.
/// @author Gabriele Rigo - <gab@rigoblock.com>
// solhint-disable-next-line
contract ATotlePrimary {

    struct Trade {
        bool isSell;
        address tokenAddress;
        uint256 tokenAmount;
        bool optionalTrade;
        uint256 minimumExchangeRate;
        uint256 minimumAcceptableTokenAmount;
        Order[] orders;
    }

    struct Order {
        address exchangeHandler;
        bytes genericPayload;
    }

    struct TradeFlag {
        bool ignoreTrade;
        bool[] ignoreOrder;
    }

    /// @dev Sends transactions to the Totle contract.
    /// @param trades Array of Structs of parameters and orders.
    /// @param id Number of the trasactions id.
    function performRebalance(
        Trade[] memory trades,
        bytes32 id
    )
        public
    {
        Trade[] memory checkedTrades = new Trade[](trades.length);
        for (uint256 i = 1; i <= trades.length; i++) {
            address ETH_TOKEN_ADDRESS = address(0);
            address targetTokenAddress = trades[i].tokenAddress;
            address oracleAddress = address(0);
            Oracle oracle = Oracle(oracleAddress);

            (uint expectedRate, ) = (oracle.getExpectedRate(
                ERC20(ETH_TOKEN_ADDRESS),
                ERC20(targetTokenAddress),
                uint256(0),
                false
                )
            );

            if (expectedRate < trades[i].minimumExchangeRate * 95 / 100)
                continue;

            if (expectedRate > trades[i].minimumExchangeRate * 105 / 100)
                continue;

            checkedTrades[i] = trades[i];
        }
        address totleAddress = address(0);
        (bool success, ) = totleAddress.call(abi.encodeWithSignature("performRebalance(Trade[] calldata, bytes32)", checkedTrades, id));
        require(
            success,
            "CALL_FAILED"
        );
    }
}