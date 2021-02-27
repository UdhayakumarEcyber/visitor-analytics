import * as React from "react";
import { registerWidget, registerLink, registerUI, IContextProvider, } from './uxp';
import { TitleBar, FilterPanel, WidgetWrapper, DatePicker } from "uxp/components";
import { Bar, CartesianGrid, Legend, ResponsiveContainer, XAxis, YAxis, Tooltip, ComposedChart, Line, Area } from 'recharts';

import './styles.scss';
const VisitorIcon = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MC41IiBoZWlnaHQ9IjUzLjk5MSIgdmlld0JveD0iMCAwIDYwLjUgNTMuOTkxIj4KICA8ZyBpZD0iR3JvdXBfNDEwMyIgZGF0YS1uYW1lPSJHcm91cCA0MTAzIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMTIzNiAtODE3LjAwOSkiPgogICAgPHBhdGggaWQ9Ikljb25fYXdlc29tZS11c2VyIiBkYXRhLW5hbWU9Ikljb24gYXdlc29tZS11c2VyIiBkPSJNMjIuOTI2LDI2LjJhMTMuMSwxMy4xLDAsMSwwLTEzLjEtMTMuMUExMy4xLDEzLjEsMCwwLDAsMjIuOTI2LDI2LjJabTkuMTcsMy4yNzVIMzAuMzg3YTE3LjgxNiwxNy44MTYsMCwwLDEtMTQuOTIyLDBIMTMuNzU2QTEzLjc1OSwxMy43NTksMCwwLDAsMCw0My4yMzJ2NC4yNThBNC45MTQsNC45MTQsMCwwLDAsNC45MTMsNTIuNEg0MC45MzlhNC45MTQsNC45MTQsMCwwLDAsNC45MTMtNC45MTNWNDMuMjMyQTEzLjc1OSwxMy43NTksMCwwLDAsMzIuMSwyOS40NzZaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxMjM2IDgxOC41OTgpIiBmaWxsPSIjNzA3MDcwIi8+CiAgICA8cmVjdCBpZD0iUmVjdGFuZ2xlXzgxMCIgZGF0YS1uYW1lPSJSZWN0YW5nbGUgODEwIiB3aWR0aD0iNCIgaGVpZ2h0PSI1LjQzMiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTI3Ny41IDgyOC4zNjcpIiBmaWxsPSIjNzA3MDcwIi8+CiAgICA8cmVjdCBpZD0iUmVjdGFuZ2xlXzgxMSIgZGF0YS1uYW1lPSJSZWN0YW5nbGUgODExIiB3aWR0aD0iNCIgaGVpZ2h0PSIxMC4zNyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTI4NC41IDgyMy40MjkpIiBmaWxsPSIjNzA3MDcwIi8+CiAgICA8cmVjdCBpZD0iUmVjdGFuZ2xlXzgxMiIgZGF0YS1uYW1lPSJSZWN0YW5nbGUgODEyIiB3aWR0aD0iNCIgaGVpZ2h0PSIxNi43OSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTI5Mi41IDgxNy4wMDkpIiBmaWxsPSIjNzA3MDcwIi8+CiAgPC9nPgo8L3N2Zz4K';
interface IWidgetProps {
    uxpContext?: IContextProvider
}
function formatHour(h:number) {
    if (h <12) return h + ' am';
    if (h== 12) return '12 pm';
    return (h-12) + ' pm';
}
const VisitorDistributionWidget: React.FunctionComponent<IWidgetProps> = (props) => {
    let [date,setDate] = React.useState(new Date());
    let [building,setBuilding] = React.useState('');
    let [chartData,setChartData] = React.useState([]);
    function updateDate(d:Date) {
        console.log('my date',d); 
        setDate(d);
    }
    React.useEffect(()=>{

        let start = new Date(Date.UTC(date.getFullYear(),date.getMonth(),date.getDate()));
        // start.setUTCHours(0);
        // start.setUTCMinutes(0);
        // start.setUTCSeconds(0);
        let end = new Date(start.toISOString());
        end.setDate(end.getDate()+1);
        console.log('sd,ed',date,start,end);
        let chartData:any[] = [];
        props.uxpContext.executeAction('VisitorAnalytics','GetVisitorCount',{location:building,bucket:'hour',start:start.toISOString(),end:end.toISOString()},{json:true})
        .then((data:any[]) => {
            data.forEach((item:any) => {
                let v:any = {count:Number(item.Value)};
                v.hour = formatHour(new Date(item.Time).getUTCHours());
                chartData.push(v);
            });
            console.log('CD',chartData);
            setChartData(chartData);
        })
        .catch(e => {});
    },[date,building]);
   
    return (
        <WidgetWrapper>
            <TitleBar icon={VisitorIcon} title='Visits'>
                <FilterPanel>
                    <DatePicker date={date} onChange={updateDate} title={'Date'} />
                </FilterPanel>
            </TitleBar>
            <div style={{ flex: 1 }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            width={500}
            height={300}
            data={chartData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeWidth={0} />
            <XAxis dataKey="hour" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#8884d8" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
        </WidgetWrapper>
    )
};

/**
 * Register as a Widget
 */
registerWidget({
    id: "visitor-analytics",
    name: "VisitorDistribution",
    widget: VisitorDistributionWidget,
    configs: {
        layout: {
            // w: 12,
            // h: 12,
            // minH: 12,
            // minW: 12
        }
    }
});

/**
 * Register as a Sidebar Link
 */
/*
registerLink({
    id: "visitor_analytics",
    label: "Visitor_analytics",
    // click: () => alert("Hello"),
    component: Visitor_analyticsWidget
});
*/

/**
 * Register as a UI
 */

 /*
registerUI({
    id:"visitor_analytics",
    component: Visitor_analyticsWidget
});
*/