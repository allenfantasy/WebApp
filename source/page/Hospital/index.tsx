import * as clipboard from 'clipboard-polyfill';
import { component, mixin, createCell, Fragment } from 'web-cell';
import { observer } from 'mobx-web-cell';

import { SpinnerBox } from 'boot-cell/source/Prompt/Spinner';
import { Card } from 'boot-cell/source/Content/Card';
import { Button } from 'boot-cell/source/Form/Button';
import { DropMenu } from 'boot-cell/source/Navigator/DropMenu';
import 'boot-cell/source/Content/EdgeDetector';
import { EdgeEvent } from 'boot-cell/source/Content/EdgeDetector';

import { suppliesRequirement, SuppliesRequirement } from '../../model';
import {
    AuditBar,
    DistrictEvent,
    DistrictFilter,
    District
} from '../../component';

interface HospitalPageState {
    loading?: boolean;
    noMore?: boolean;
}

@observer
@component({
    tagName: 'hospital-page',
    renderTarget: 'children'
})
export class HospitalPage extends mixin<{}, HospitalPageState>() {
    state = {
        loading: false,
        noMore: false
    };

    districtFilter: District;

    loadMore = async ({ detail }: EdgeEvent) => {
        const {
            state: { loading, noMore },
            districtFilter
        } = this;

        if (detail !== 'bottom' || loading || noMore) return;

        await this.setState({ loading: true });

        const data = await suppliesRequirement.getNextPage(districtFilter);

        await this.setState({ loading: false, noMore: !data });
    };

    changeDistrict = async ({ detail }: DistrictEvent) => {
        this.districtFilter = detail;

        await this.setState({ loading: true });

        suppliesRequirement.clear();
        const data = await suppliesRequirement.getNextPage(detail);

        await this.setState({ loading: false, noMore: !data });
    };

    async clip2board(raw: string) {
        await clipboard.writeText(raw);

        self.alert('已复制到剪贴板');
    }

    renderItem = ({
        hospital,
        supplies = [],
        province,
        city,
        district,
        address,
        contacts,
        ...rest
    }: SuppliesRequirement) => (
        <Card
            className="mx-auto mb-4 mx-sm-1"
            style={{ minWidth: '20rem', maxWidth: '20rem' }}
            title={hospital}
        >
            <ol>
                {supplies.map(({ name, count, remark }) => (
                    <li title={remark}>
                        {name}{' '}
                        <span className="badge badge-danger">{count}个</span>
                    </li>
                ))}
            </ol>

            <div className="text-center">
                <Button
                    onClick={() =>
                        this.clip2board(province + city + district + address)
                    }
                >
                    邮寄地址
                </Button>

                {contacts && (
                    <DropMenu
                        className="d-inline-block ml-3"
                        alignType="right"
                        title="联系方式"
                        list={contacts.map(({ name, phone }) => ({
                            title: `${name}：${phone}`,
                            href: 'tel:' + phone
                        }))}
                    />
                )}
            </div>

            <AuditBar scope="hospital" model={suppliesRequirement} {...rest} />
        </Card>
    );

    render(_, { loading, noMore }: HospitalPageState) {
        return (
            <Fragment>
                <header className="d-flex justify-content-between align-item-center my-3">
                    <h2>医院急需物资</h2>
                    <span>
                        <Button kind="warning" href="hospital/edit">
                            需求发布
                        </Button>
                    </span>
                </header>

                <DistrictFilter onChange={this.changeDistrict} />

                <edge-detector onTouchEdge={this.loadMore}>
                    <SpinnerBox
                        cover={loading}
                        className="card-deck justify-content-around"
                    >
                        {suppliesRequirement.list.map(this.renderItem)}
                    </SpinnerBox>
                    <p slot="bottom" className="text-center mt-2">
                        {noMore ? '没有更多数据了' : '加载更多...'}
                    </p>
                </edge-detector>
            </Fragment>
        );
    }
}
