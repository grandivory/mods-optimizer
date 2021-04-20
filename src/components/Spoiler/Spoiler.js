import React from "react";

import "./Spoiler.css";

export class Spoiler extends React.PureComponent {
    spoilerContent

    componentDidMount() {
        console.log(this.spoilerContent.scrollHeight);
        this.spoilerContent.style.setProperty('--content-height', this.spoilerContent.scrollHeight + 'px');
    }

    render() {
        return (
            <div className={'spoiler'}>
                <div
                    className={'title'}
                    onClick={e => e.target.parentNode.classList.toggle('open')}>
                    {this.props.title}
                </div>
                <div className={'divider'} />
                <div className={'content'} ref={(element) => this.spoilerContent = element}>
                    {this.props.children}
                </div>
            </div>
        );
    }
};