import { connect } from 'react-redux';
import ContextAsideTrade from '../components/context/asideTrade';
import ContextHeader from '../components/context/header';
import has from 'lodash/has';
import moment from 'moment';
import currencyFormatter from 'currency-formatter';
import { capitalizeFirstLetter } from '../utils/functions';
import DeleteOrdelModal from '../components/orders/deleteOrderModal';
import MobileFixedFooter from '../components/mobile_fixed_footer';
import IndexOrderTable from '../components/indexOrderTable';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      allOrders: [],
      myTrades: false,
      isOpenDeleteOrderModal: false,
      order: null,
      initialMount: true,
    };
  }

  handleChangeGraph = (pair = null) => {
    const symbol = pair
      ? pair.replace('_', '').toUpperCase()
      : this.props.currentPair.replace('/', '');
    if (TradingView && Datafeeds && this.props.currentPair) {
      new TradingView.widget({
        fullscreen: true,
        symbol,
        interval: 'D',
        container_id: 'tradingview_e47e3',
        theme: 'Dark',
        datafeed: new Datafeeds.UDFCompatibleDatafeed(
          this.props.appConfig.chart
        ),
        library_path: '/static/tv/',
        locale: 'pt',
        drawings_access: {
          type: 'black',
          tools: [{ name: 'Regression Trend' }],
        },
        enabled_features: ['study_templates'],
        charts_storage_url: 'https://saveload.tradingview.com',
        charts_storage_api_version: '1.1',
        client_id: 'tradingview.com',
        user_id: 'public_user',
        toolbar_bg: '#222222',
        loading_screen: {
          backgroundColor: '#222222',
          foregroundColor: '#222222',
        },
        overrides: {
          'mainSeriesProperties.style': 1,
          'symbolWatermarkProperties.color': '#00BE96',
          'paneProperties.background': '#000000',
          'paneProperties.vertGridProperties.color': '#111',
          'paneProperties.horzGridProperties.color': '#111',
          'symbolWatermarkProperties.transparency': 99,
          'scalesProperties.textColor': '#AAA',
        },
      });
    }
  };

  handleOpenDeleteModal = (isOpenDeleteOrderModal, order) => {
    this.setState({ isOpenDeleteOrderModal, order });
  };

  componentDidMount() {
    this.handleChangeGraph();
  }

  componentDidUpdate() {
    const { livroOrdens, currentPair } = this.props;
    if (
      this.state.initialMount &&
      Object.keys(livroOrdens).length >= 0 &&
      has(livroOrdens[currentPair], 'orderBook')
    ) {
      this.setState({ initialMount: false });
    }
  }

  render() {
    const { trades = {}, currentPair, balance = {}, userProfile } = this.props;
    const { myTrades } = this.state;

    const userId = userProfile.uid ? userProfile.uid : 0;

    const basePair = () => {
      const pair = currentPair.split('/');

      const currency = balance.find(item => item.currency === pair[0]);

      if (!currency) {
        return {
          currency_name: '',
          currency_symbol: '',
          balance: '',
        };
      }

      return {
        currency_name: capitalizeFirstLetter(currency.currency_name),
        currency_symbol: currency.currency_symbol,
        balance: currency.available_balance,
      };
    };

    const currencySymbol =
      (Object.keys(balance).length > 0 && basePair().currency_symbol) || '';

    return (
      <div>
        <div style={{ display: 'flex' }}>
          <ContextAsideTrade handleChangeGraph={this.handleChangeGraph} />
          <main className="main">
            <ContextHeader />
            <div className="content_wrap">
              <section>
                <div
                  style={{ height: '300px' }}
                  className="tradingview-widget-container"
                >
                  <div
                    ref={el => (this.graph = el)}
                    id="tradingview_e47e3"
                    style={{ width: '100%' }}
                  />
                </div>
              </section>
              <section className="sec-table">
                <IndexOrderTable
                  handleOpenDeleteModal={this.handleOpenDeleteModal}
                  initialMount={this.state.initialMount}
                  orderBox={this.orderBox}
                  currencySymbol={currencySymbol}
                />

                <div className="table-main--trades">
                  <h3 className="table-main__caption">TRADES</h3>
                  <div className="table-main__buttons">
                    <button
                      onClick={() => this.setState({ myTrades: false })}
                      className={`table-main__button table-main__button${!myTrades &&
                        '--active'}`}
                    >
                      Todos
                    </button>
                    <button
                      onClick={() => this.setState({ myTrades: true })}
                      className={`table-main__button table-main__button${myTrades &&
                        '--active'}`}
                    >
                      Meus
                    </button>
                  </div>
                  <table className="table-main">
                    <thead>
                      <tr className="table-main__tr">
                        <th>Quantidade</th>
                        <th>Preço unitário</th>
                        <th>Data/Hora</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.keys(trades).length > 0 &&
                        has(trades[currentPair], 'trades') &&
                        !myTrades &&
                        trades[currentPair].trades.map((data, index) => (
                          <TrTableTrade
                            key={index}
                            trade={data}
                            currencySymbol={currencySymbol}
                          />
                        ))}

                      {Object.keys(trades).length > 0 &&
                        has(trades[currentPair], 'trades') &&
                        myTrades &&
                        trades[currentPair].trades
                          .filter(
                            item =>
                              item.user_id_active === userId ||
                              item.user_id_passive === userId
                          )
                          .map((data, index) => (
                            <TrTableTrade
                              key={index}
                              trade={data}
                              currencySymbol={currencySymbol}
                            />
                          ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          </main>

          {this.state.isOpenDeleteOrderModal && (
            <DeleteOrdelModal
              handleClose={() => this.handleOpenDeleteModal(false, null)}
              order={this.state.order}
            />
          )}
          <MobileFixedFooter />
        </div>
      </div>
    );
  }
}

const TrTableTrade = ({ trade, currencySymbol }) => {
  return (
    <tr>
      <td>
        {currencyFormatter.format(trade.amount, {
          symbol: currencySymbol,
          format: '%s %v',
          decimal: ',',
          thousand: '.',
          precision: 8,
        })}
      </td>
      <td className={`${trade.side==='buy'? "buy-text": "sell-text"}`}>
        {currencyFormatter.format(trade.price_unity, {
          symbol: 'R$',
          format: '%s %v',
          decimal: ',',
          thousand: '.',
          precision: 2,
        })}
      </td>
      <td>
        <time>{moment(trade.time_executed).format('DD/MM/YYYY HH:mm')}</time>
      </td>
    </tr>
  );
};

const mapStateToProps = state => {
  const {
    myBalance: { balance },
    userProfile,
    appConfig,
  } = state.users;
  const {
    livroOrdens,
    livroOrdensAcumulado,
    trades,
    currentPair,
  } = state.orders;
  return {
    livroOrdens,
    livroOrdensAcumulado,
    trades,
    currentPair,
    balance,
    userProfile,
    appConfig,
  };
};
export default connect(mapStateToProps)(Dashboard);
