import { Component } from 'react'
import { View, Text } from '@tarojs/components'
import LinkageSearch from '../../components/linkage-search/index';
import './index.scss'

export default class Index extends Component {

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    return (
      <View className='index'>
        <Text>Hello world!</Text>
        <LinkageSearch></LinkageSearch>
      </View>
    )
  }
}
